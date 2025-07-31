import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo_title.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow">
      <div className="container-fluid">
        <button
          className="navbar-brand btn p-0 border-0 bg-transparent"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="Logo" width="150" height="50" className="d-inline-block align-top me-2" />
        </button>
        <button className="btn btn-primary ms-auto">
          Settings
        </button>
      </div>
    </header>
  );
};

export default Header;