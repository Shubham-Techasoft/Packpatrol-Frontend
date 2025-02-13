import * as React from 'react';
import { Button, TextField, Box, Typography, Grid } from '@mui/material';

interface SignUpProps {
  signUp: (email: string, password: string, name: string) => Promise<{ success?: string; error?: string }>;
}

const CustomSignUpPage: React.FC<SignUpProps> = ({ signUp }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState<{ success?: string; error?: string }>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await signUp(email, password, name);
    setMessage(response);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up
      </Typography>

      {message.success && <Typography color="success.main">{message.success}</Typography>}
      {message.error && <Typography color="error.main">{message.error}</Typography>}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Full Name"
          variant="outlined"
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Or sign up with:
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Button variant="outlined" fullWidth>GitHub</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="outlined" fullWidth>Google</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomSignUpPage;
