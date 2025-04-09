import React, { useEffect, useState } from 'react';
import API from '../services/api';

function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    API.get('/users/me').then(res => {
      setFormData({ ...formData, name: res.data.name, email: res.data.email });
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await API.put('/users/me', formData);
    setMessage(res.data.message);
    setFormData({ ...formData, password: '' });
  };

  return (
    <div className="container">
      <h1>👤 Profile</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" placeholder="New Password (optional)" value={formData.password} onChange={handleChange} />
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default ProfilePage;
