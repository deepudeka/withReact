// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import PaperDetailPage from './pages/PaperDetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import ProfilePage from './pages/ProfilePage'; // Create later
import UploadPaperPage from './pages/UploadPaperPage'; // Create later
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <div className="container" style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {<Route path="/upload-paper" element={<UploadPaperPage />} />}

          {/* CORRECTED LINE: */}
          <Route path="/papers/:id" element={<PaperDetailPage />} />
          {/* Add other routes here, ensuring they are all <Route> components */}
        </Routes>
      </div>
    </>
  );
}

export default App;
