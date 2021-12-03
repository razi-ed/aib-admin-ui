import React from 'react';
// import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';

import AuthLayout from './components/auth-layout';
import LoginPage from './pages/login';

const App = () => {

  if (false) {
  // if (auth.user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/portal" replace />;
  }

  return (
    <Routes>
      <Route path="/auth" element={<AuthLayout />} >
        <Route path="login" element={<LoginPage />} />
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