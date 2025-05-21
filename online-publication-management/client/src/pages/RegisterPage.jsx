// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api'; // or authService

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Password: '',
        Institution: '',
        Country: '',
        // Add other fields as needed
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { FullName, Email, Password, Institution, Country } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        if (Password.length < 6) {
            setError('Password must be at least 6 characters');
            setLoading(false);
            return;
        }
        try {
            await register(formData);
            navigate('/'); // Redirect to home or dashboard after registration
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label>Full Name:</label>
                    <input type="text" name="FullName" value={FullName} onChange={onChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="Email" value={Email} onChange={onChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="Password" value={Password} onChange={onChange} required />
                </div>
                <div>
                    <label>Institution (Optional):</label>
                    <input type="text" name="Institution" value={Institution} onChange={onChange} />
                </div>
                <div>
                    <label>Country (Optional):</label>
                    <input type="text" name="Country" value={Country} onChange={onChange} />
                </div>
                {/* Add other fields from Users table as needed */}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default RegisterPage;