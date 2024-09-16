import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './JobBoardPage.module.css';

export default function JobBoardPage({ columns, setColumns, newJob }) {
  const [localColumns, setLocalColumns] = useState(columns);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(localColumns));
  }, [localColumns]);

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  // Add job to the relevant column based on the job status
  useEffect(() => {
    if (newJob) {
      const updatedColumns = { ...localColumns };
      const status = newJob.status;
      if (updatedColumns[status]) {
        updatedColumns[status].items.push(newJob);
        setLocalColumns(updatedColumns);
        setColumns(updatedColumns);
      }
    }
  }, [newJob, localColumns, setColumns]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceColumn = localColumns[source.droppableId];
    const destColumn = localColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    
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
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${styles.card} ${snapshot.isDragging ? styles.dragging : ''}`}
                        >
                          <h4 className={styles.cardTitle}>{item.company_name} - {item.job_title}</h4>
                          <p className={styles.jobDescription}>{item.job_description}</p>
                          <p><strong>Notes:</strong> {item.notes}</p>
                          <p className={styles.dateText}><strong>Created At:</strong> {item.created_at}</p>
                          <p className={styles.dateText}><strong>Updated At:</strong> {item.updated_at}</p>
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
