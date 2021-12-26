import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';
import categoryReducer, { moduleName as categoriesModuleName } from '../../categories/services/slice';
import authorReducer, { moduleName as authorsModuleName } from '../../authors/services/slice';
import coachReducer, { moduleName as coachModuleName } from '../../coaches/services/slice';
import contactUsReducer, { moduleName as contactUssModuleName } from '../../contactUs/services/slice';
import hireStudentReducer, { moduleName as hireStudentModuleName } from '../../hireStudent/services/slice';
import emailEnquiryReducer, { moduleName as emailEnquiryModuleName } from '../../emailEnquiry/services/slice';
import webinarsReducer, { moduleName as webinarsModuleName } from '../../webinars/services/slice';


const reducer = {
  auth: authReducer,
  user: userReducer,
  [categoriesModuleName]: categoryReducer,
  [authorsModuleName]: authorReducer,
  [coachModuleName]: coachReducer,
  [contactUssModuleName]: contactUsReducer,
  [hireStudentModuleName]: hireStudentReducer,
  [emailEnquiryModuleName]: emailEnquiryReducer,
  [webinarsModuleName]: webinarsReducer
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});