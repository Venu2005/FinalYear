import React, { useState, useEffect } from 'react';



function ClientList() {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null); // Track errors
  const [searchQuery, setSearchQuery] = useState(''); // Track the search input

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/clients');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setClients(data); // Update the state with fetched clients
      } catch (err) {
        setError(err.message); // Handle errors
      }
    };

    fetchClients();
  }, []); // Empty dependency array ensures this runs once on component mount

  // Filter clients based on the search query
  const filteredClients = clients.filter((client) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      client.Name.toLowerCase().includes(searchTerm) ||
      client.PhoneNumber.includes(searchTerm)
    );
  });

  // Handle delete action
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this client?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/clients/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`Failed to delete client: ${response.statusText}`);
        }

        // Remove the client from the state
        setClients(clients.filter((client) => client.ClientID !== id));
        alert('Client deleted successfully!');
      } catch (err) {
        alert(`Error deleting client: ${err.message}`);
      }
    }
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
                <strong>{client.Name}</strong> - {client.PhoneNumber} - {client.Email}
              </div>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ClientList;
