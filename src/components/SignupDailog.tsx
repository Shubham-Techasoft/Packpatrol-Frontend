import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import CustomSignUpPage from './CustomSignUpPage';

interface CombinedSignUpPageProps {
  open: boolean;
  onClose: () => void;
}

const signUp = async (email: string, password: string, name: string) => {
  return new Promise<{ success?: string; error?: string }>((resolve) => {
    setTimeout(() => {
      console.log(`Signing up user: ${name} with email: ${email}`);
      if (email.includes('@')) {
        resolve({ success: 'Signup successful! Please check your email.' });
      } else {
        resolve({ error: 'Invalid email format' });
      }
    }, 500);
  });
};

const CombinedSignUpPage: React.FC<CombinedSignUpPageProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Sign Up
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <CustomSignUpPage signUp={signUp} />
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignUpPage;
