import React from 'react';
import PaperListPage from './PaperListPage'; // Import the new component

const HomePage = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return (
        <div>
            <h1>Welcome to the Publication Management System</h1>
            {userInfo ? <p>Hello, {userInfo.FullName}!</p> : <p>Please log in or register to explore.</p>}
            <hr />
            <PaperListPage /> {/* Display papers here */}
        </div>
    );
};

export default HomePage;