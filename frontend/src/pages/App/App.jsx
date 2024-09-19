import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getUser } from '../../services/authService';
import './App.css';
import NavBar from '../../components/NavBar/NavBar';
import HomePage from '../HomePage/HomePage';
import JobBoardPage from '../JobBoardPage/JobBoardPage';
import NewJobAppPage from '../NewJobAppPage/NewJobAppPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import LogInPage from '../LogInPage/LogInPage';

function App() {
  const [user, setUser] = useState(getUser());

  const [columns, setColumns] = useState({
    wishlist: { name: "Wishlist", items: [] },
    applied: { name: "Applied", items: [] },
    interview: { name: "Interview", items: [] },
    offer: { name: "Offer", items: [] },
    rejected: { name: "Rejected", items: [] }
  });

  const [job, setJob] = useState(null);

  const handleNewJob = (job) => {
    setNewJob(job);
  };

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
            <Route path="/board" element={<JobBoardPage columns={columns} setColumns={setColumns} job={job} />} />
            <Route path="/board/new" element={<NewJobAppPage onJobSubmit={handleNewJob} />} />
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
