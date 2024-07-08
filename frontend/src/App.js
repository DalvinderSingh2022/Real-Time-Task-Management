import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Register from './pages/Register';
import Notfound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';

import Layout from './components/Layout';
import Loading from './components/Loading';

import { AuthContext } from './store/AuthContext';

const App = () => {
  const [loadingMsg, setLoadingMsg] = useState('');
  const { authState, login } = useContext(AuthContext);

  useEffect(() => {
    if (authState.authenticated)
      return;

    setLoadingMsg("Fetching your details, please wait...");

    axios.get("http://localhost:4000/api/users/current", {
      headers: {
        Authorization: localStorage.getItem("jwt")
      }
    })
      .then(({ data }) => {
        const { name, email } = data;
        login({ name, email });
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoadingMsg(''));

  }, [login, authState]);

  if (loadingMsg) {
    return <Loading message={loadingMsg} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path='*' element={<Notfound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;