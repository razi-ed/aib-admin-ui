import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';
import categoryReducer, { moduleName as categoriesModuleName } from '../../categories/services/slice';

const reducer = {
  auth: authReducer,
  user: userReducer,
  [categoriesModuleName]: categoryReducer,
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});