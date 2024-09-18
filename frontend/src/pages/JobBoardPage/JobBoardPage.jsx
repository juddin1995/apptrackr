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
  
    const updatedColumns = JSON.parse(JSON.stringify(localColumns));
    const sourceColumn = updatedColumns[source.droppableId];
    const destColumn = updatedColumns[destination.droppableId];
  
    const [movedItem] = sourceColumn.items.splice(source.index, 1);
  
    if (source.droppableId === destination.droppableId) {
      sourceColumn.items.splice(destination.index, 0, movedItem);
    } else {
      destColumn.items.splice(destination.index, 0, movedItem);
      movedItem.status = destination.droppableId.toLowerCase();
      await jobAppService.updateJobStatus(movedItem._id, movedItem.status);
    }
  
    setLocalColumns(updatedColumns);
    setColumns(updatedColumns);
  };
  

  return (
    <>
    <h1>Job Board</h1>
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
                          <div><strong>Notes</strong> {item.notes.map(note => <p key={note._id}>{note.content}</p>)}</div>
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
    </>
  );
}
