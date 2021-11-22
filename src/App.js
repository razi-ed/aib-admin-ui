import React from 'react';
// import { useSelector } from 'react-redux';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Layout from './modules/common/components/layout';
import LoginPage from './modules/auth/components/login';

import './App.css';

const App = () => {
  const location = useLocation();

  if (false) {
  // if (!auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return (
    <Routes>
      <Route path="/portal" element={<Layout />} >
        <Route index element={<p>home</p>} />
        <Route path="categories" element={<p>categories</p>} />
        {/*
          Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for.
        */}
        <Route path="*" element={<p>404</p>} />
      </Route>
    </Routes>
  );
}

export default App;