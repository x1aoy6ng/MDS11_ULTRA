import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import LoginDialog from './auth/login_dialog';
import PasscodeDialog from './auth/passcode_dialog';
import {useAuth} from './auth/use_auth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false)
  const {
    authState,
    showLoginDialog,
    showPasscodeDialog,
    currentEmail,
    openLoginDialog,
    closeAllDialog,
    handleEmailContinue,
    handlePasscodeContinue,
    handleResendPasscode,
    logout
  } = useAuth();

  useEffect(() => {
    // check the saved theme on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark'){
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark){
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };


  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white dark:bg-[#222222] shadow-sm py-3 z-50">
        <div className="flex items-center justify-between px-6">
          {/* Logo */}
          <button
            className="p-0 bg-transparent border-none cursor-pointer"
            onClick={() => navigate('/')}
            aria-label='Home'
          >
            <img src={logo} alt="Logo" width="155" className="inline-block align-top" />
          </button>

          <div className='flex items-center gap-2'>
            {/* Login/Logout Button*/}
            {authState.isAuthenticated? (
              <button
                onClick={logout}
                className='px-4 py-1 text-lg flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer  text-primary dark:text-primary-dark hover:bg-[#F1F5F8] hover:bg-opacity-80 dark:hover:bg-[#313032] dark:hover:bg-opacity-80 transition-colors duration-200 ease-in-out'
              >
                Logout
              </button>
            ): (
              <button
                onClick={openLoginDialog}
                className='px-4 py-1 text-lg flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer  text-primary dark:text-primary-dark hover:bg-[#F1F5F8] hover:bg-opacity-80 dark:hover:bg-[#313032] dark:hover:bg-opacity-80 transition-colors duration-200 ease-in-out'
              >
                Login
              </button>
            )}
          
            {/* Dark/Light Mode Button */}
            <button
              onClick={toggleTheme}
              className='w-10 h-10 flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer  text-primary dark:text-primary-dark hover:bg-[#F1F5F8] hover:bg-opacity-80 dark:hover:bg-[#313032] dark:hover:bg-opacity-80 transition-colors duration-200 ease-in-out'
            >
              {isDark? 
                <span className="material-symbols-rounded">dark_mode</span> : 
                <span className="material-symbols-rounded">light_mode</span>
              }
            </button>
          </div>
        </div>
      </header>


      {/* Authentication dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={closeAllDialog}
        onContinue={handleEmailContinue}
      />

      <PasscodeDialog
        isOpen={showPasscodeDialog}
        email={currentEmail}
        onClose={closeAllDialog}
        onContinue={handlePasscodeContinue}
        onResend={handleResendPasscode}
      />
    </>
  );
};

export default Header;