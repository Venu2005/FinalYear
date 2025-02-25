import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setClients(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      client.Name.toLowerCase().includes(searchTerm) ||
      client.PhoneNumber.includes(searchTerm)
    );
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/clients/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error(`Failed to delete client: ${response.statusText}`);
        }
        setClients(clients.filter((client) => client.ClientID !== id));
        alert('Client deleted successfully!');
      } catch (err) {
        alert(`Error deleting client: ${err.message}`);
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/client/${id}`);
  };

  return (
    <div>
      <h2>Clients List</h2>

      {/* Search Bar */}
      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or phone number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '8px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      </div>

      {/* Error Message or Client List */}
      {error ? (
        <p style={{ color: 'red' }}>Failed to load clients: {error}</p>
      ) : (
        <ul>
          {filteredClients.map((client) => (
            <li
              key={client.ClientID}
              style={{
                backgroundColor: '#fff',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <strong>{client.Name}</strong> - {client.PhoneNumber} 
              </div>

               {/* Right Section: Buttons */}
  <div style={{ display: 'flex', gap: '10px' }}>
    <button
      onClick={() => handleViewDetails(client.ClientID)}
      style={{
        backgroundColor: '#3498db',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      View Details
    </button>
    <button
      onClick={() => handleDelete(client.ClientID)}
      style={{
        backgroundColor: '#e74c3c',
        color: '#fff',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
    >
      Delete
    </button>
  </div>
</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientList;
