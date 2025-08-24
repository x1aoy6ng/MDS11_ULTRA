import React, {useState, useEffect} from "react";
import IconButton from '../button';

interface PasscodeDialogProps {
    isOpen: boolean;
    email: string;
    onClose: () => void;
    onContinue: (passcode: string) => Promise<void>;
    onResend: () => Promise<void>;
}

const PasscodeDialog: React.FC<PasscodeDialogProps> = ({isOpen, email, onClose, onContinue, onResend}) => {
    // passcode, resendTimer, loading
    const [passcode, setPasscode] = useState(['', '', '', '', '', ''])
    const [resendTimer, setResendTimer] = useState(60);
    const [isLoading, setIsLoading] = useState(false);

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

      // reset timer when dialog opens
      useEffect(() => {
        if (isOpen){
            setResendTimer(60);
        }
      }, [isOpen]);

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

    const handleContinue = async() => {
        const code = passcode.join('');
        if (code.length === 6){
            setIsLoading(true);
            try {
                await onContinue(code);
                // reset the passcode on successful login
                setPasscode(['', '', '', '', '', '']);
            } catch (error){
                console.error('Error in verifying the passcode: ', error)
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleResendPasscode = async() => {
        if (resendTimer === 0){
            try{
                await onResend();
                setResendTimer(60);
            } catch (error){
                console.error('Error in resending passcode: ', error)
            }
        }
    };

    const handlePasscodeKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && passcode.join('').length === 6 && !isLoading){
            handleContinue();
        }
    };

    const handleClose = () => {
        setPasscode(['', '', '', '', '', '']);
        setResendTimer(0);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
        handleClose();
        }
    };

    if (!isOpen) return null;

    return (
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
                      onKeyPress={handlePasscodeKeyPress}
                      disabled={isLoading}
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
                    disabled={resendTimer > 0 || isLoading}
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
                  onClick={handleContinue}
                  ariaLabel="Continue"
                  disabled={passcode.join('').length !== 6 || isLoading}
                >
                  {isLoading? 'Verifying...': 'Continue'}
                </IconButton>
              </div>
            </div>
          </div>
        </div>
    )
};

export default PasscodeDialog;