import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './JobBoardPage.module.css';
import * as jobAppService from '../../services/jobAppService';

export default function JobBoardPage({ columns, setColumns, job }) {
  const [localColumns, setLocalColumns] = useState(columns);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    async function fetchJobApplications() {
      if (hasFetchedData.current) return;
  
      try {
        const jobApps = await jobAppService.getJobApps();
        console.log(jobApps);
  
        const updatedColumns = { ...localColumns };
        Object.keys(updatedColumns).forEach(columnId => {
          updatedColumns[columnId].items = [];
        });
  
        jobApps.forEach(job => {
          const status = job.status;
          if (updatedColumns[status]) {
            updatedColumns[status].items.push(job);
          }
        });
  
        setLocalColumns(updatedColumns);
        setColumns(updatedColumns);
        hasFetchedData.current = true;
      } catch (error) {
        console.error('Failed to fetch job applications:', error);
      }
    }
    fetchJobApplications();
  }, [localColumns, setColumns]);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(localColumns));
  }, [localColumns]);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (job) {
      const updatedColumns = { ...localColumns };
      const status = job.status;
      if (updatedColumns[status]) {
        console.log(`Adding job to status ${status}`);
        updatedColumns[status].items.push(job);
        setLocalColumns(updatedColumns);
        setColumns(updatedColumns);
      }
    }
  }, [job, localColumns, setColumns]);
  

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = localColumns[source.droppableId];
    const destColumn = localColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    if (source.droppableId === destination.droppableId) { 
      const save = destItems[destination.index];
      destItems[destination.index] = removed;
      destItems[source.index] = save;
    } else {
      destItems.splice(destination.index, 0, removed);
      const newStatus = destColumn.name.toLowerCase();
      await jobAppService.updateJobStatus(removed._id, newStatus);
      removed.status = newStatus;
    }

    const updatedColumns = {
      ...localColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    };

    setLocalColumns(updatedColumns);
    setColumns(updatedColumns);
  };

  return (
    <div className={styles.board}>
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(localColumns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${styles.column} ${snapshot.isDraggingOver ? styles.draggingOver : ''}`}
              >
                <h2 className={styles.columnTitle}>{column.name}</h2>
                <div className={styles.columnContent}>
                  {column.items.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
                        >
                          <h4 className={styles.cardTitle}>{item.companyName} - {item.jobTitle}</h4>
                          <p className={styles.jobDescription}>{item.jobDescription}</p>
                          <div><strong>Notes:</strong> {item.notes.map(note => <p key={note._id}>{note.content}</p>)}</div>
                          <p className={styles.dateText}><strong>Created At:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
                          <p className={styles.dateText}><strong>Updated At:</strong> {new Date(item.updatedAt).toLocaleDateString()}</p>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
