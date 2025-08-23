import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import IconButton from './button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showPasscodeDialog, setShowPasscodeDialog] = useState(false)
  // email, passcode, resend timer
  const [email, setEmail] = useState('')
  const [passcode, setPasscode] = useState(['', '', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(0)
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    // check the saved theme on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark'){
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  // timer for resend button
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (resendTimer > 0){
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

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

  // validate the email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
  }

  const handleLoginClick = () => {
    setShowLoginDialog(true);
    setEmailError('');
  }

  const handleCloseDialog = () => {
    setShowLoginDialog(false);
    setShowPasscodeDialog(false);
    setEmail('');
    setPasscode(['', '', '', '', '', '']);
    setResendTimer(0);
    setEmailError('');
  }

  const handleContinue = async () =>{
    const trimmedEmail = email.trim();
    if (!trimmedEmail){
      setEmailError('Please enter your email address');
      return;
    }

    if (!isValidEmail(trimmedEmail)){
      setEmailError('Please enter a valid email address');
      return;
    }

    try{
        // call backend API to send passcode email

        // if successful, show passcode dialog
        setEmailError('')
        setShowLoginDialog(false)
        setShowPasscodeDialog(true)
        setResendTimer(60); // 60 seconds
      } catch (error){
          console.error('Error in sending passcode: ', error)
          setEmailError('Failed to send passcode. Please try again.');
      }
  }

  const handlePasscodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)){
      const newPasscode = [...passcode];
      newPasscode[index] = value;
      setPasscode(newPasscode);

      // auto focus the next input
      if (value && index < 5){
        const nextInput = document.getElementById(`passcode-${index+1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePasscodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !passcode[index] && index > 0){
      const previousInput = document.getElementById(`passcode-${index-1}`);
      previousInput?.focus();
    }
  };

  const handlePasscodeContinue = async() => {
    const code = passcode.join('');
    if (code.length === 6){
      try{
        // call backend API to verify the passcode

        // if successful, close the dialog and handle login
        console.log('Login successful with email: ', email)
        handleCloseDialog();
      } catch (error){
        console.error('Error in verifying passcode')
      }
    }
  };

  const handleResendPasscode = async() => {
    if (resendTimer === 0){
      try{
        // call backend API to resend the passcode

        setResendTimer(60);
      } catch (error){
        console.error('Error in resending passcode')
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    // clear the error when user starts typing
    if (emailError){
      setEmailError('')
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter'){
      handleContinue();
    }
  };

  const handlePasscodePress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter'){
      handlePasscodeContinue();
    }
  };

  // close the dialog when user clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget){
      handleCloseDialog();
    }
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
          {/* Login Button*/}
          <button
            onClick={handleLoginClick}
            className='px-4 py-1 text-lg flex items-center justify-center rounded-xl bg-transparent border-none cursor-pointer  text-primary dark:text-primary-dark hover:bg-[#F1F5F8] hover:bg-opacity-80 dark:hover:bg-[#313032] dark:hover:bg-opacity-80 transition-colors duration-200 ease-in-out'
          >
            Login
          </button>

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

    {/* Login Dialog */}
      {showLoginDialog && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]'
          onClick={handleBackdropClick}
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 relative'>
            {/* Close button */}
            <button
              onClick={handleCloseDialog}
              className='absolute top-4 right-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200'
              aria-label="Close dialog"
            >
              <span className="material-symbols-rounded">close</span>
            </button>

            {/* Dialog Content */}
            <div className='p-8 pt-12'>
              {/* header */}
              <div className='text-center mb-8'>
                <h2 className='text-3xl font-bold text-primary dark:text-primary-dark mb-3'>
                  Welcome To ULTRA
                </h2>
                <p className='text-gray-500 dark:text-gray-300'>
                  Login or Sign Up with email.
                </p>
              </div>

              {/* Email Input */}
              <div className='mb-6'>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                    <span className="material-symbols-rounded text-gray-400">mail</span>
                  </div>
                  <input
                    type='email'
                    value={email}
                    onChange={handleEmailChange}
                    onKeyPress={handleKeyPress}
                    placeholder='Please enter your email...'
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                      emailError 
                        ? 'border-red-500 focus:ring-red-300' 
                        : 'border-gray-200 dark:border-gray-600 focus:ring-blue-300'
                    }`}
                    autoFocus
                  />
                </div>
                {emailError && (
                  <p className='text-red-500 text-sm mt-2 pl-2'>{emailError}</p>
                )}
              </div>

              {/* Continue Button */}
              <div className='flex items-center justify-center'>
                <IconButton
                  icon={null}
                  onClick={handleContinue}
                  ariaLabel="Continue"
                  disabled={!email.trim()}
                >
                  Continue
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Passcode Dialog Modal */}
      {showPasscodeDialog && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]'
          onClick={handleBackdropClick}
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 relative'>
            {/* Close button */}
            <button
              onClick={handleCloseDialog}
              className='absolute top-4 right-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200'
              aria-label="Close dialog"
            >
              <span className="material-symbols-rounded">close</span>
            </button>

            {/* Dialog Content */}
            <div className='p-8 pt-12'>
              {/* header */}
              <div className='text-center mb-8'>
                <h2 className='text-2xl font-bold text-primary dark:text-primary-dark mb-3'>
                  Enter Passcode
                </h2>
                <p className='text-gray-600 dark:text-gray-300'> 
                  A 6-digit passcode was sent to your email at
                </p>
                <p className='text-gray-700 dark:text-white font-medium'>
                  {email}
                </p>
              </div>

              {/* Passcode Input */}
              <div className='mb-6'>
                <div className='flex justify-center gap-3 mb-3'>
                  {passcode.map((digit, index) => (
                    <input
                      key={index}
                      id={`passcode-${index}`}
                      type='text'
                      inputMode='numeric'
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePasscodeChange(index, e.target.value)}
                      onKeyDown={(e) => handlePasscodeKeyDown(index, e)}
                      onKeyPress={handlePasscodePress}
                      className='w-12 h-12 text-center text-xl font-semibold border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition-all duration-200'
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Resend link */}
                <div className='text-center mb-6'>
                  <span className='text-gray-600 dark:text-gray-400 text-sm'>Didn't get it? </span>
                  <button
                    onClick={handleResendPasscode}
                    disabled={resendTimer > 0}
                    className='text-sm text-blue-500 hover:text-blue-600 disabled:text-gray-400 transition-colors duration-200' 
                  >
                    Resend {resendTimer > 0 && `${resendTimer}s`}
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <div className='flex items-center justify-center'>
                <IconButton
                  icon={null}
                  onClick={handlePasscodeContinue}
                  ariaLabel="Continue"
                  disabled={passcode.join('').length !== 6}
                >
                  Continue
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;