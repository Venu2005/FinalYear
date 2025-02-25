import React, { useState } from 'react';
import axios from 'axios';

const AddClient = () => {
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    preferences: '',
    lastVisitDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/addclients', client)
      .then(response => {
        alert('Client added successfully!');
        setClient({
          name: '',
          email: '',
          phone: '',
          preferences: '',
          lastVisitDate: ''
        });
      })
      .catch(error => {
        console.log(error);
        alert('Error adding client!');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Client</h3>
      <input
        type="text"
        name="name"
        value={client.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="email"
        name="email"
        value={client.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="text"
        name="phone"
        value={client.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
      />
      <input
        type="text"
        name="preferences"
        value={client.preferences}
        onChange={handleChange}
        placeholder="Service done"
        required
      />
      <input
        type="date"
        name="lastVisitDate"
        value={client.lastVisitDate}
        onChange={handleChange}
        placeholder="Last Visit Date"
        required
      />
      <button type="submit">Add Client</button>
    </form>
  );
};

export default AddClient;
