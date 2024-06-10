import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Import useNavigate hook
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore  } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

export function SignIn() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [formErrors, setFormErrors] = React.useState({});
  const [authError, setAuthError] = React.useState('');
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const validate = () => {
    let errors = {};
    if (!email) errors.email = 'Email is required';
    if (!password) errors.password = 'Password is required';
    setFormErrors(errors);
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate();

    if (Object.keys(errors).length === 0) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in:', user);
        setAuthError(''); // Clear any previous auth errors
        
        // Redirect to home after sign in
        navigate('/');
      } catch (error) {
        console.error('Error signing in:', error.message);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || 'auth/invalid-credential') {
          setAuthError('Invalid email or password');
        } else {
          setAuthError('An unexpected error occurred');
        }
      }
    }
  };
  // Function to create a document in Firestore for the user
const createUserDocument = async () => {
  // Get the current user from Firebase Authentication
  const user = auth.currentUser;
  
  // Check if user is authenticated
  if (user) {
    try {
      // Create a document in Firestore with user's UID as document ID
      await setDoc(doc(firestore, 'favorites', user.uid), {
      });

      console.log('User document created successfully.');
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  } else {
    console.error('User is not authenticated.');
  }
};

createUserDocument();

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormErrors((prev) => ({ ...prev, email: '' }));
              }}
              error={!!formErrors.email}
              helperText={formErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormErrors((prev) => ({ ...prev, password: '' }));
              }}
              error={!!formErrors.password}
              helperText={formErrors.password}
            />
            {authError && (
              <Typography color="error" variant="body2">
                {authError}
              </Typography>
            )}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link component={RouterLink} to="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

