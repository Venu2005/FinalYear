import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClientList from './components/ClientList';
import AddClient from './components/AddClient';
import UpdateClient from './components/UpdateClient';
import './App.css'; // Import the CSS styles

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header>
          <h1>Salon Management</h1>
          <nav>
            <a href="/">Clients List</a> | <a href="/add-client">Add Client</a>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ClientList />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/update-client/:id" element={<UpdateClient />} />
          </Routes>
        </main>
        <footer>
          <p>&copy; 2024 Salon Management</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
