import React, { useState, useEffect } from 'react';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [showPastAppointments, setShowPastAppointments] = useState(false);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [searchClient, setSearchClient] = useState('');
  const [searchService, setSearchService] = useState('');
  const [newAppointment, setNewAppointment] = useState({
    ClientID: '',
    ServiceID: '',
    StylistName: 'Chamath',
    AppointmentDate: '',
    AppointmentTime: '',
  });

  const stylists = ['Chamath', 'Shemil', 'Heshan', 'Maheshi', 'Kavinda', 'Imasha'];

  useEffect(() => {
    fetchAppointments();
  }, []);



  
  const fetchAppointments = async () => {
    try {
      const res = await fetch('http://localhost:5000/appointments');
      if (!res.ok) throw new Error('Failed to fetch appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch(`http://localhost:5000/clients?search=${searchClient}`);
        if (!res.ok) throw new Error('Failed to fetch clients');
        setFilteredClients(await res.json());
      } catch (err) {
        console.error('Error fetching clients:', err);
      }
    };
    if (searchClient) fetchClients();
    else setFilteredClients([]);
  }, [searchClient]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`http://localhost:5000/services?search=${searchService}`);
        if (!res.ok) throw new Error('Failed to fetch services');
        setFilteredServices(await res.json());
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };
    if (searchService) fetchServices();
    else setFilteredServices([]);
  }, [searchService]);



  const handleSearchClient = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchClient(query);

    if (query) {
      setFilteredClients(
        clients.filter(
          (client) =>
            (client.Name && client.Name.toLowerCase().includes(query)) ||
            (client.Phone && client.Phone.includes(query))
        )
      );
    } else {
      setFilteredClients([]);
    }
  };

  const handleSelectClient = (client) => {
    setNewAppointment({
      ...newAppointment,
      ClientID: client.ClientID,
      ClientName: client.Name,
    });
    setSearchClient(client.Name + ' (' + client.Phone + ')'); // Display selected client in input
    setFilteredClients([]); // Hide dropdown
  };

  const handleSearchService = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchService(query);

    if (query) {
      setFilteredServices(
        services.filter(
          (service) => service.ServiceName && service.ServiceName.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredServices([]);
    }
  };

  const handleSelectService = (service) => {
    setNewAppointment({
      ...newAppointment,
      ServiceID: service.ServiceID,
      ServiceName: service.ServiceName,
    });
    setSearchService(service.ServiceName); // Display selected service in input
    setFilteredServices([]); // Hide dropdown
  };





  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.ClientID || !newAppointment.ServiceID || !newAppointment.AppointmentDate || !newAppointment.AppointmentTime) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAppointment, Status: 'Scheduled' }),
      });

      if (!response.ok) throw new Error('Failed to add appointment');

      alert('Appointment added successfully!');
      setNewAppointment({
        ClientID: '',
        ServiceID: '',
        StylistName: 'Chamath',
        AppointmentDate: '',
        AppointmentTime: '',
      });
      fetchAppointments(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      fetchAppointments(); // Refresh list
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Filter upcoming and past appointments
  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.AppointmentDate >= today && appointment.Status === 'Scheduled'
  );

  const pastAppointments = appointments.filter(
    (appointment) => appointment.AppointmentDate < today || appointment.Status !== 'Scheduled'
  );

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        {/* Past Appointments Toggle Button */}
        <button
          onClick={() => setShowPastAppointments(!showPastAppointments)}
          style={{ padding: '10px 15px', backgroundColor: '#7f8c8d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          {showPastAppointments ? 'Show Upcoming Appointments' : 'Show Past Appointments'}
        </button>
      </div>

      <h1>Manage Appointments</h1>

      <form onSubmit={handleAddAppointment} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search Client by Name or Phone"
          value={searchClient}
          onChange={handleSearchClient}
          required
        />
        {searchClient && (
          <ul style={{ maxHeight: '150px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
            {filteredClients.map((client) => (
              <li
                key={client.ClientID}
                onClick={() =>handleSelectClient(client)}
                style={{ cursor: 'pointer' }}
              >
                {client.Name} ({client.PhoneNumber})
              </li>
            ))}
          </ul>
        )}

        <input
          type="text"
          placeholder="Search Service"
          value={searchService}
          onChange={handleSearchService}
          required
        />
        {searchService && (
          <ul style={{ maxHeight: '150px', overflowY: 'auto', listStyle: 'none', padding: 0 }}>
            {filteredServices.map((service) => (
              <li
                key={service.ServiceID}
                onClick={() => handleSelectService(service)}
                style={{ cursor: 'pointer' }}
              >
                {service.ServiceName}
              </li>
            ))}
          </ul>
        )}

        <select
          value={newAppointment.StylistName}
          onChange={(e) => setNewAppointment({ ...newAppointment, StylistName: e.target.value })}
        >
          {stylists.map((stylist) => (
            <option key={stylist} value={stylist}>
              {stylist}
            </option>
          ))}
        </select>

        <input type="date" value={newAppointment.AppointmentDate} onChange={(e) => setNewAppointment({ ...newAppointment, AppointmentDate: e.target.value })} required />
        <input type="time" value={newAppointment.AppointmentTime} onChange={(e) => setNewAppointment({ ...newAppointment, AppointmentTime: e.target.value })} required />
        <button type="submit">Add Appointment</button>
      </form>

      <h3>{showPastAppointments ? 'Past Appointments' : 'Upcoming Appointments'}</h3>

      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
            <th style={{ padding: '10px' }}>Client</th>
            <th>Service</th>
            <th>Stylist</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {(showPastAppointments ? pastAppointments : upcomingAppointments).map((appointment) => (
            <tr key={appointment.AppointmentID}>
              <td style={{ padding: '10px' }}>{appointment.ClientName}</td>
              <td>{appointment.ServiceName}</td>
              <td>{appointment.StylistName}</td>
              <td>{new Date(appointment.AppointmentDate).toLocaleDateString()}</td>
              <td>{appointment.AppointmentTime}</td>
              <td>
                <select value={appointment.Status} onChange={(e) => handleStatusChange(appointment.AppointmentID, e.target.value)}>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentsPage;
