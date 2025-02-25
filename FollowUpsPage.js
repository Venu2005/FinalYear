import React, { useEffect, useState } from 'react';

function FollowUpsPage() {
  const [followUps, setFollowUps] = useState([]);
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [message, setMessage] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default to Pending

  useEffect(() => {
    fetchFollowUps();
    fetchClients();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const response = await fetch('http://localhost:5000/followups');
      const data = await response.json();
      setFollowUps(data);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:5000/clients-followup');
      const data = await response.json();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = clients.filter(
      (client) =>
        (client.Name && client.Name.toLowerCase().includes(query)) ||
        (client.Phone && client.Phone.includes(query))
    );

    setFilteredClients(filtered);
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setSearchQuery(client.Name + ' (' + client.Phone + ')');
    setFilteredClients([]);
  };

  const handleAddFollowUp = async (e) => {
    e.preventDefault();
    if (!selectedClient || !message || !followUpDate) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ClientID: selectedClient.ClientID,
          Message: message,
          FollowUpDate: followUpDate,
          Status: 'Pending',
        }),
      });

      if (response.ok) {
        alert('Follow-up added successfully');
        fetchFollowUps();
        setSelectedClient(null);
        setMessage('');
        setFollowUpDate('');
        setSearchQuery('');
      } else {
        alert('Failed to add follow-up');
      }
    } catch (error) {
      console.error('Error adding follow-up:', error);
    }
  };

  const handleStatusChange = async (followUpId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/followups/${followUpId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchFollowUps(); // Refresh follow-ups
    } catch (error) {
      console.error('Error updating follow-up status:', error);
      alert('Error updating status');
    }
  };

  const toggleFilterStatus = () => {
    if (filterStatus === 'Pending') {
      setFilterStatus('Sent');
    } else if (filterStatus === 'Sent') {
      setFilterStatus('Failed');
    } else {
      setFilterStatus('Pending');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={toggleFilterStatus}
          style={{
            padding: '10px 15px',
            backgroundColor: '#7f8c8d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          {filterStatus === 'Pending' ? 'Show Sent Follow-Ups' : filterStatus === 'Sent' ? 'Show Failed Follow-Ups' : 'Show Pending Follow-Ups'}
        </button>
      </div>

      <h1>Client Follow-Ups</h1>

      <form onSubmit={handleAddFollowUp} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Client by Name or Phone"
          value={searchQuery}
          onChange={handleSearch}
          required
        />
        {searchQuery && (
          <ul style={{ maxHeight: '150px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
            {filteredClients.map((client) => (
              <li
                key={client.ClientID}
                onClick={() => handleSelectClient(client)}
                style={{ cursor: 'pointer' }}
              >
                {client.Name} ({client.Phone})
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          placeholder="Follow-up Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <input
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          required
        />
        <button type="submit">Add Follow-Up</button>
      </form>

      <h3>{filterStatus} Follow-Ups</h3>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
            <th style={{ padding: '10px' }}>Client Name</th>
            <th>Phone Number</th>
            <th>Message</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {followUps
            .filter((followUp) => followUp.Status === filterStatus)
            .sort((a, b) => new Date(a.FollowUpDate) - new Date(b.FollowUpDate))
            .map((followUp) => (
              <tr key={followUp.FollowUpID}>
                <td style={{ padding: '10px' }}>{followUp.ClientName}</td>
                <td>{followUp.ClientPhone || 'N/A'}</td>
                <td>{followUp.Message}</td>
                <td>{new Date(followUp.FollowUpDate).toLocaleDateString()}</td>
                <td>
                  <select value={followUp.Status} onChange={(e) => handleStatusChange(followUp.FollowUpID, e.target.value)}>
                    <option value="Pending">Pending</option>
                    <option value="Sent">Sent</option>
                    <option value="Failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default FollowUpsPage;
