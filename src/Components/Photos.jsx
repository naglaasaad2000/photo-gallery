import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { fetchPhotos } from '../services/pexelsService';
import { auth, firestore } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export function Photos(){
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null); // State to hold the current user
  const [favorites, setFavorites] = useState([]); // State to hold user's favorites

  useEffect(() => {
    const getPhotos = async () => {
      const fetchedPhotos = await fetchPhotos();
      setPhotos(fetchedPhotos);
    };

    getPhotos();

    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Update the user state when the authentication state changes
      if (user) {
        // If user is logged in, fetch their favorites from Firestore
        fetchUserFavorites(user.uid);
      }
    });

    // Cleanup function
    return () => {
      unsubscribe(); // Unsubscribe from the auth state listener when the component unmounts
    };
  }, []);

  const fetchUserFavorites = async (userId) => {
    const userRef = doc(firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      setFavorites(docSnap.data().favorites || []);
    }
  };

 const addToFavorites = async (photoUrl) => {
  if (!user) {
    alert('Please sign in to add favorites.');
    return;
  }

  const userRef = doc(firestore, 'users', user.uid);
  if (favorites.includes(photoUrl)) {
    // If photo is already in favorites, remove it
    await updateDoc(userRef, {
      favorites: arrayRemove(photoUrl),
    });
    setFavorites(favorites.filter((fav) => fav !== photoUrl)); // Update the favorites state
  } else {
    // If photo is not in favorites, add it
    await updateDoc(userRef, {
      favorites: arrayUnion(photoUrl),
    });
    setFavorites([...favorites, photoUrl]); // Update the favorites state
  }
};

  return (
    <Grid container spacing={2}>
      {photos.map((photo) => (
        <Grid item xs={12} sm={6} md={4} key={photo.id} style={{ height: '300px' }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <img
              src={photo.src.medium}
              alt={photo.photographer}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'white',
              }}
              onClick={() => addToFavorites(photo.src.medium)}
            >
              {favorites.includes(photo.src.medium) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

export default Photos;
