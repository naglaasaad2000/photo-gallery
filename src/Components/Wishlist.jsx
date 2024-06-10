import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export function Wishlist(){
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      const fetchFavorites = async () => {
        const userRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        }
      };
      fetchFavorites();
    } else {
      navigate('/signin');
    }
  });

  return unsubscribe;
}, [navigate]);


  return (
    <Grid container spacing={2}>
      {favorites.map((photoUrl, index) => (
        <Grid item xs={12} sm={6} md={4} key={index} style={{ height: '300px' }}>
          <div style={{ position: 'relative', height: '100%' }}>
            <img
              src={photoUrl}
              alt="Wishlist Item"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

