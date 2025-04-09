import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.response?.data?.msg || 'Login failed');
        }
    };

    const goToRegister = () => navigate('/register');

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <h2>Login</h2>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <br />
                <input
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account?</p>
            <button onClick={goToRegister}>Register</button>
        </div>
    );
}

export default LoginPage;
