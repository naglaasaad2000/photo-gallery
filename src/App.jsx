import logo from './logo.svg';
import React from 'react';
import './App.css';
import {BrowserRouter as Router , Routes, Route} from "react-router-dom";
import {SignUp} from './Components/SignUp';
import {SignIn} from './Components/SignIn';
import {Photos} from './Components/Photos';
import {Home}  from './Components/Home';
import {Wishlist} from './Components/Wishlist';
import {SharedLayout} from './shared-layouts/sharedLayout';
import {NotFound} from './Components/NotFound';

function App() {  
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<SharedLayout />}>
            <Route index element={<Home/>} />
            <Route path='/photos' element={<Photos/>}/>
            <Route path='/wishlist' element={<Wishlist/>}/>
          </Route>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/signin' element={<SignIn />}/>
          <Route path='*' element={<NotFound/>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
