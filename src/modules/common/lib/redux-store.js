import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';
import categoryReducer, { moduleName as categoriesModuleName } from '../../categories/services/slice';
import authorReducer, { moduleName as authorsModuleName } from '../../authors/services/slice';
import coachReducer, { moduleName as coachModuleName } from '../../coaches/services/slice';
import courseReducer, { moduleName as courseModuleName } from '../../courses/services/slice';

const reducer = {
  auth: authReducer,
  user: userReducer,
  [categoriesModuleName]: categoryReducer,
  [authorsModuleName]: authorReducer,
  [coachModuleName]: coachReducer,
  [courseModuleName]: courseReducer,
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});