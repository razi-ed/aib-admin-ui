import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';
import categoryReducer, { moduleName as categoriesModuleName } from '../../categories/services/slice';
import authorReducer, { moduleName as authorsModuleName } from '../../authors/services/slice';

const reducer = {
  auth: authReducer,
  user: userReducer,
  [categoriesModuleName]: categoryReducer,
  [authorsModuleName]: authorReducer,
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});