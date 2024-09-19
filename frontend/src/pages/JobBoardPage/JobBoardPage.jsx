import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTrash } from "react-icons/fa";
import styles from "./JobBoardPage.module.css";
import * as jobAppService from "../../services/jobAppService";

export default function JobBoardPage({ columns, setColumns }) {
  const [localColumns, setLocalColumns] = useState(columns);
  const [deleteItemConfirmation, setDeleteItemConfirmation] = useState(null);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    async function fetchJobApplications() {
      if (hasFetchedData.current) return;

      try {
        const jobApps = await jobAppService.getJobApps();

        const updatedColumns = { ...localColumns };
        Object.keys(updatedColumns).forEach((columnId) => {
          updatedColumns[columnId].items = [];
        });

        jobApps.forEach((job) => {
          const status = job.status;
          if (updatedColumns[status]) {
            updatedColumns[status].items.push(job);
          }
        });

        setLocalColumns(updatedColumns);
        setColumns(updatedColumns);
        hasFetchedData.current = true;
      } catch (error) {
        console.error("Failed to fetch job applications:", error);
      }
    }
    fetchJobApplications();
  }, [localColumns, setColumns]);

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

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

  const handleDelete = async (id) => {
    try {
      await jobAppService.deleteJobApp(id);
      const updatedColumns = { ...localColumns };
      Object.keys(updatedColumns).forEach((columnId) => {
        updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
          (item) => item._id !== id
        );
      });
      setLocalColumns(updatedColumns);
      setColumns(updatedColumns);
      setDeleteItemConfirmation(null);
    } catch (error) {
      console.error("Failed to delete job application:", error);
    }
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
                  className={`${styles.column} ${
                    snapshot.isDraggingOver ? styles.draggingOver : ""
                  }`}
                >
                  <h2 className={styles.columnTitle}>{column.name}</h2>
                  <div className={styles.columnContent}>
                    {column.items.map((item, index) => (
                      <Draggable
                        key={item._id}
                        draggableId={item._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${styles.card} ${
                              snapshot.isDragging ? styles.dragging : ""
                            }`}
                          >
                            <h4 className={styles.cardTitle}>
                              {item.companyName} - {item.jobTitle}
                            </h4>
                            <p className={styles.jobDescription}>
                              {item.jobDescription}
                            </p>
                            <div>
                              <strong>Notes</strong>{" "}
                              {item.notes.map((note) => (
                                <p key={note._id}>{note.content}</p>
                              ))}
                            </div>
                            <p className={styles.dateText}>
                              <strong>Created At:</strong>{" "}
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                            <p className={styles.dateText}>
                              <strong>Updated At:</strong>{" "}
                              {new Date(item.updatedAt).toLocaleDateString()}
                            </p>

                            {deleteItemConfirmation === item._id ? (
                              <div className={styles.deleteConfirmation}>
                                <button
                                  className={`${styles.confirmationButton} ${styles.cancel}`}
                                  onClick={() =>
                                    setDeleteItemConfirmation(null)
                                  }
                                >
                                  Cancel
                                </button>
                                <button
                                  className={styles.confirmationButton}
                                  onClick={() => handleDelete(item._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            ) : (
                              <div className={styles.trashIconContainer}>
                                <FaTrash
                                  className={styles.trashIcon}
                                  onClick={() =>
                                    setDeleteItemConfirmation(item._id)
                                  }
                                />
                              </div>
                            )}
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
