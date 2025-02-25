import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [missedAppointments, setMissedAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch('http://localhost:5000/appointments');
        if (!res.ok) throw new Error('Failed to fetch appointments');
        const data = await res.json();

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];

        // Filter appointments
        const dueAppointments = data.filter(
          (appointment) => appointment.AppointmentDate === today
        );

        const pastAppointments = data.filter(
          (appointment) =>
            appointment.AppointmentDate < today && appointment.Status === 'Scheduled'
        );

        setTodaysAppointments(dueAppointments);
        setMissedAppointments(pastAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, []);

  // Calculate total notifications (missed + today's)
  const totalNotifications = missedAppointments.length + todaysAppointments.length;

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '50px 20px',
        backgroundColor: '#f4f6f8',
        minHeight: '100vh',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '3rem', color: '#2c3e50', margin: '0' }}>
          Welcome to Salon Management
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#7f8c8d', margin: '10px 0 20px' }}>
          Manage your clients, appointments, and preferences seamlessly.
        </p>
      </header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <Link to="/ClientList" style={styles.button}>View Clients</Link>
        <Link to="/add-client" style={{ ...styles.button, backgroundColor: '#27ae60' }}>Add Client</Link>
        
        {/* Manage Appointments Button with Notification Badge */}
        
                <div style={{ position: 'relative', display: 'inline-block' }}>
          <Link to="/appointments" style={{ ...styles.button, backgroundColor: '#9b59b6' }}>
            Manage Appointments
          </Link>
          {totalNotifications > 0 && (
            <span style={styles.notificationBadge}>
              {totalNotifications}
            </span>
          )}
        </div>


        <Link to="/follow-ups" style={{ ...styles.button, backgroundColor: '#e67e22' }}>Follow-ups</Link>
      </div>
    </div>
  );
}

// Styles for Buttons and Notification Badge
const styles = {
  button: {
    textDecoration: 'none',
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '15px 30px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: '-15px',  // Moves the badge slightly up
    right: '-10px', // Positions it to the top right of the button
    backgroundColor: '#e74c3c',
    color: 'white',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '6px 10px',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  
};

export default HomePage;
