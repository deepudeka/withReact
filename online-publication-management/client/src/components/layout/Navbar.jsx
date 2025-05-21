import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken'); // Simple check for login

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo'); // Remove user info as well
        navigate('/login');
        // Optionally: dispatch a logout action if using Context/Redux
    };

    return (
        <nav style={{ background: '#333', padding: '1rem', color: 'white' }}>
            <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
            {userToken ? (
                <>
                    <Link to="/profile" style={{ color: 'white', marginRight: '1rem' }}>Profile</Link>
                    <Link to="/upload-paper" style={{ color: 'white', marginRight: '1rem' }}>Upload Paper</Link>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>
                        Logout
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" style={{ color: 'white', marginRight: '1rem' }}>Login</Link>
                    <Link to="/register" style={{ color: 'white', marginRight: '1rem' }}>Register</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;