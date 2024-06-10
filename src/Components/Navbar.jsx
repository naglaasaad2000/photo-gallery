import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import MoreIcon from '@mui/icons-material/MoreVert';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        // Create a user document if it doesn't exist
        const userRef = doc(firestore, 'users', user.uid);
        setDoc(userRef, { favorites: [] }, { merge: true });
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    handleMenuClose();
  };

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      // Redirect to the wishlist page
      navigate('/wishlist');
    } else {
      // Redirect to the sign-in page
      navigate('/signin');
    }
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleSignOut}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {isAuthenticated ? (
        [
          <MenuItem key="profile" onClick={handleProfileMenuOpen}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="primary-search-account-menu"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Profile</p>
          </MenuItem>,
          <MenuItem key="logout" onClick={handleSignOut}>
            <IconButton
              size="large"
              aria-label="logout"
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <p>Logout</p>
          </MenuItem>
        ]
      ) : (
        [
          <MenuItem key="signin" onClick={() => navigate('/signin')}>
            <p>Sign In</p>
          </MenuItem>,
          <MenuItem key="signup" onClick={() => navigate('/signup')}>
            <p>Sign Up</p>
          </MenuItem>
        ]
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container>
          <Toolbar>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              Photo Gallery
            </Typography>
            <StyledIconButton color="inherit" onClick={handleFavoriteClick}>
              <FavoriteIcon />
            </StyledIconButton>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {isAuthenticated ? (
                <>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <AccountCircle />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => navigate('/signin')}>Sign In</Button>
                  <Button color="inherit" onClick={() => navigate('/signup')}>Sign Up</Button>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
