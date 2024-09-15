import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import JobBoardPage from '../JobBoardPage/JobBoardPage';
import NewPostPage from '../NewJobAppPage/NewJobAppPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';

const defaultColumns = {
  wishlist: {
    name: "Wishlist",
    items: [
      { id: '1', company_name: "Google", job_title: "Software Engineer", job_description: "Develop software applications.", notes: "Interview scheduled next week.", created_at: "2024-09-01", updated_at: "2024-09-10" },
      { id: '2', company_name: "Facebook", job_title: "Product Manager", job_description: "Manage product development.", notes: "Waiting for response.", created_at: "2024-08-20", updated_at: "2024-09-05" }
    ]
  },
  applied: {
    name: "Applied",
    items: [
      { id: '3', company_name: "Amazon", job_title: "Backend Developer", job_description: "Build and maintain backend services.", notes: "Application submitted.", created_at: "2024-08-25", updated_at: "2024-09-02" }
    ]
  },
  interview: {
    name: "Interview",
    items: []
  },
  offer: {
    name: "Offer",
    items: []
  },
  rejected: {
    name: "Rejected",
    items: []
  }
};

function App() {
  const [user, setUser] = useState(getUser());

  const loadColumns = () => {
    const savedColumns = localStorage.getItem('columns');
    return savedColumns ? JSON.parse(savedColumns) : defaultColumns;
  };

  const [columns, setColumns] = useState(loadColumns);

  useEffect(() => {
    localStorage.setItem('columns', JSON.stringify(columns));
  }, [columns]);

  return (
    <main id="react-app">
      <NavBar user={user} setUser={setUser} />
      <section id="main-section">
        {user ? (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/board" element={<JobBoardPage columns={columns} setColumns={setColumns} />} />
            <Route path="/board/new" element={<NewPostPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage user={user} />} />
            <Route path="/login" element={<LogInPage setUser={setUser} />} />
            <Route path="/signup" element={<SignUpPage setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </section>
    </main>
  );
}

export default App;
