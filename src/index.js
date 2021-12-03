import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import AuthLayer from './modules/auth';
import store from './modules/common/lib/redux-store';

import 'antd/dist/antd.css';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Provider store={store}>
        <App />
        <AuthLayer />
      </Provider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root'),
);