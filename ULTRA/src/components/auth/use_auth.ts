import {useState} from "react";

export interface AuthState{
    isAuthenticated: boolean;
    user: {email: string} | null;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        user: null
    });

    // login, passcode dialog, email
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [showPasscodeDialog, setShowPasscodeDialog] = useState(false);
    const [currentEmail, setCurrentEmail] = useState('');

    const sendPasscode = async(email: string): Promise<void> => {
        // update API calls here
        
    };

    const verifyPasscode = async(email: string, passcode: string): Promise<void> => {
        // update API calls here

        // update the auth state
        setAuthState({
            isAuthenticated: true,
            user: {email},
        });

        // store the token
    };

    // control the dialog
    const openLoginDialog = () => {
        setShowLoginDialog(true);
    }

    const closeAllDialog = () => {
        setShowLoginDialog(false);
        setShowPasscodeDialog(false);
        setCurrentEmail('')
    }

    const handleEmailContinue = async(email: string) => {
        await sendPasscode(email);
        setCurrentEmail(email);
        setShowLoginDialog(false);
        setShowPasscodeDialog(true);
    };

    const handlePasscodeContinue = async(passcode: string) => {
        await verifyPasscode(currentEmail, passcode);
        closeAllDialog();
    };

    const handleResendPasscode = async() => {
        if (currentEmail){
            await sendPasscode(currentEmail);
        }
    };

    const logout = () => {
        setAuthState({
            isAuthenticated: false,
            user: null
        });
        localStorage.removeItem('auth_token');
    };

    return {
        // auth state
        authState,
        // dialog state
        showLoginDialog,
        showPasscodeDialog,
        currentEmail,
        // actions
        openLoginDialog,
        closeAllDialog,
        handleEmailContinue,
        handlePasscodeContinue,
        handleResendPasscode,
        logout
    }
};