import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';

const reducer = {
  auth: authReducer,
  user: userReducer,
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});