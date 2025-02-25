import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/clients/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setClient(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchClientDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const handleSave = async () => {
    const confirmSave = window.confirm('Are you sure you want to save the changes?');
    if (confirmSave) {
      try {
        const response = await fetch(`http://localhost:5000/clients/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(client),
        });
        if (!response.ok) {
          throw new Error(`Failed to update client: ${response.statusText}`);
        }
        alert('Client details updated successfully!');
        navigate('/');
      } catch (err) {
        alert(`Error saving client details: ${err.message}`);
      }
    }
  };

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;
  }

  if (!client) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading client details...</p>;
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '30px auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Client Details</h2>
      <form>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Name:</label>
          <input
            type="text"
            value={client.Name}
            onChange={(e) => setClient({ ...client, Name: e.target.value })}
            style={{
              width: '80%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Email:</label>
          <input
            type="email"
            value={client.Email}
            onChange={(e) => setClient({ ...client, Email: e.target.value })}
            style={{
              width: '80%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Phone Number:</label>
          <input
            type="text"
            value={client.PhoneNumber}
            onChange={(e) => setClient({ ...client, PhoneNumber: e.target.value })}
            style={{
              width: '80%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Services Done:</label>
          <textarea
            value={client.Preferences}
            onChange={(e) => setClient({ ...client, Preferences: e.target.value })}
            style={{
              width: '80%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '5px',
              minHeight: '100px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#34495e' }}>Last Visit Date:</label>
          {/* Display formatted date */}
          <input
  type="date"
  
  onChange={(e) => setClient({ ...client, LastVisitDate: e.target.value })}
  style={{
    width: '80%',
    padding: '10px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
  }}
/>

          {/* Display formatted string for Last Visit Date */}
          <p style={{ marginTop: '10px', color: '#34495e' }}>Last Visit Date : {formatDate(client.LastVisitDate)}</p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px',
            backgroundColor: '#27ae60',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default ClientDetails;
