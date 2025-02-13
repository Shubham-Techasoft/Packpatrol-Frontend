import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import {
  AuthResponse,
  SignInPage,
  type AuthProvider,
  SupportedAuthProvider,
} from '@toolpad/core/SignInPage';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface CombinedSignInPageProps {
  open: boolean;
  onClose: () => void;
}

const providers: { id: SupportedAuthProvider; name: string }[] = [
  { id: 'github', name: 'GitHub' },
  { id: 'google', name: 'Google' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'nodemailer', name: 'Email' },
];

const signIn: (provider: AuthProvider) => Promise<AuthResponse> = async (
  provider,
) => {
  return new Promise<AuthResponse>((resolve) => {
    setTimeout(() => {
      console.log(`Sign in with ${provider.id}`);
      if (provider.id === 'nodemailer') {
        resolve({ success: 'Check your email for a verification link.' });
      } else {
        resolve({ error: 'Under Development' });
      }
    }, 500);
  });
};

const CombinedSignInPage: React.FC<CombinedSignInPageProps> = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Sign In
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <AppProvider theme={theme}>
          <SignInPage
            signIn={signIn}
            providers={providers}
            slotProps={{ emailField: { autoFocus: false } }}
          />
        </AppProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignInPage;
