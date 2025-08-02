import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm py-3 z-50">
      <div className="flex items-center justify-between px-6">
        {/* Logo */}
        <button
          className="p-0 bg-transparent border-none cursor-pointer"
          onClick={() => navigate('/')}
          aria-label='Home'
        >
          <img src={logo} alt="Logo" width="155" className="inline-block align-top" />
        </button>

        {/* Settings */}
        <button 
          className="flex items-center justify-center bg-transparent border-none cursor-pointer"
          onClick={() => navigate('/settings')}
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
          <span className='sr-only'>Settings</span>
        </button>
      </div>
    </header>
  );
};

export default Header;