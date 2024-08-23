import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/users/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setSuccess('Login successful!');
            setError(null);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            setSuccess(null);
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password:
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit">Log In</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
            <p>Don't have an account? <Link to="/register" className="link">Register here</Link></p>
        </div>
    );
}
