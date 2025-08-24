import React, {useState} from 'react';
import IconButton from '../button';

interface LoginDialogProps {
    // dialog currently visible?
    isOpen: boolean;
    // close the dialog when user clicks 'X' or outside screen
    onClose: () => void;
    // asynchronous, checking email against server, send verifications
    onContinue: (email: string) => Promise<void>;
}

const LoginDialog: React.FC<LoginDialogProps> = ({isOpen, onClose, onContinue}) => {
    // email, email error, loading
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // email validate function
    const isValidEmail = (email: string): boolean =>{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleContinue = async() => {
        const trimmedEmail = email.trim();

        // check whether user enter valid email
        if (!trimmedEmail){
            setEmailError('Please enter your email address');
            return;
        }

        if (!isValidEmail(trimmedEmail)){
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsLoading(true)
        try{
            await onContinue(trimmedEmail);
            setEmail('');
            setEmailError('');
        } catch (error){
            setEmailError('Failed to send passcode. Please try again');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        // clear the error when users start to type
        if (emailError){
            setEmailError('');
        }
    };

    // when user clicks enter instead of continue
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading){
            handleContinue();
        }
    };

    // when user close the dialog
    const handleClose = () => {
        setEmail('')
        setEmailError('')
        onClose();
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget){
            handleClose();
        }
    };

    if (!isOpen) return null;

    return(
        <div
          className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]'
          onClick={handleBackdropClick}
        >
          <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg mx-4 relative'>
            {/* Close button */}
            <button
              onClick={handleClose}
              disabled={isLoading}
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
                    disabled={isLoading}
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
                  disabled={!email.trim() || isLoading}
                >
                  {isLoading? 'Sending...':'Continue'}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
    );
};

export default LoginDialog;