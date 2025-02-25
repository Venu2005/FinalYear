import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'; // Import Link component
import ClientList from './components/ClientList';
import AddClient from './components/AddClient';
import ClientDetails from './components/ClientDetails';
import HomePage from './components/HomePage';
import AppointmentsPage from './components/AppointmentsPage';
import LoginPage from './components/LoginPage';
import './App.css';
import FollowUpsPage from './components/FollowUpsPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status from local storage
  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle login action
  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="App">
        {isAuthenticated && (
          <header>
            <h1>Salon Management</h1>
            <nav>
              <Link to="/Home">Home</Link> | 
              <Link to="/ClientList">Clients List</Link> | 
              <Link to="/add-client">Add Client</Link> | 
              <Link to="/appointments">Appointments</Link>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </nav>
          </header>
        )}
        <main>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/Home" replace /> : <LoginPage onLogin={handleLogin} />} />
            {isAuthenticated ? (
              <>
                <Route path="/Home" element={<HomePage />} />
                <Route path="/ClientList" element={<ClientList />} />
                <Route path="/add-client" element={<AddClient />} />
                <Route path="/client/:id" element={<ClientDetails />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/follow-ups" element={<FollowUpsPage />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/" replace />} />
            )}
          </Routes>
        </main>
        <footer>
          <p>&copy; 2025 Salon Management</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
