import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top py-3">
      <div className="container-fluid">
        <button
          className="navbar-brand btn p-0 border-0 bg-transparent"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          aria-label='Home'
        >
          <img src={logo} alt="Logo" width="155" className="d-inline-block align-top ms-3" />
        </button>

        <button 
          className="btn ms-auto me-2 d-flex align-items-center"
          onClick={() => navigate('/settings')}
          style={ {background: "transparent", border: 'none', cursor: 'pointer'}}
        >
          <span 
            className="material-symbols-rounded"
            aria-hidden="true"
            style={{
              fontSize: '35px',
              color: '#187FF5'
            }}
          >
            settings
          </span>
          <span className='visually-hidden'>Settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;