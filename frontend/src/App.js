import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppProvider } from './context/AppContext';

import Register from './pages/Register';
import Notfound from './pages/NotFound';
import Login from './pages/Login';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='*' element={<Notfound />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;