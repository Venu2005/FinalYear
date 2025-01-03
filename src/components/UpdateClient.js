import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateClient = ({ match }) => {
  const [client, setClient] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    axios.get(`http://localhost:5000/clients/${match.params.id}`)
      .then(response => {
        setClient(response.data);
      })
      .catch(error => console.log(error));
  }, [match.params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:5000/clients/${match.params.id}`, client)
      .then(response => {
        alert('Client updated successfully!');
      })
      .catch(error => console.log(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Client</h3>
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
        name="address"
        value={client.address}
        onChange={handleChange}
        placeholder="Address"
        required
      />
      <button type="submit">Update Client</button>
    </form>
  );
};

export default UpdateClient;
