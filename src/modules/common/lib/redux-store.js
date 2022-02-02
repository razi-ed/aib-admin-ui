import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../services/auth/auth.slice';
import userReducer from '../../users/services/user.slice';
import categoryReducer, { moduleName as categoriesModuleName } from '../../categories/services/slice';
import authorReducer, { moduleName as authorsModuleName } from '../../authors/services/slice';
import coachReducer, { moduleName as coachModuleName } from '../../coaches/services/slice';
import courseReducer, { moduleName as courseModuleName } from '../../courses/services/slice';
import contactUsReducer, { moduleName as contactUssModuleName } from '../../contactUs/services/slice';
import hireStudentReducer, { moduleName as hireStudentModuleName } from '../../hireStudent/services/slice';
import emailEnquiryReducer, { moduleName as emailEnquiryModuleName } from '../../emailEnquiry/services/slice';
import webinarsReducer, { moduleName as webinarsModuleName } from '../../webinars/services/slice';
import studentReducer, { moduleName as studentModuleName } from '../../student/services/slice';
import couponReducer, { moduleName as couponModuleName } from '../../coupon/services/slice';
import codingEnablersReducer, { moduleName as codingEnablersModuleName } from '../../coding-enablers/services/slice';


const reducer = {
  auth: authReducer,
  user: userReducer,
  [categoriesModuleName]: categoryReducer,
  [authorsModuleName]: authorReducer,
  [coachModuleName]: coachReducer,
  [coachModuleName]: coachReducer,
  [courseModuleName]: courseReducer,
  [contactUssModuleName]: contactUsReducer,
  [hireStudentModuleName]: hireStudentReducer,
  [emailEnquiryModuleName]: emailEnquiryReducer,
  [webinarsModuleName]: webinarsReducer,
  [studentModuleName]: studentReducer,
  [couponModuleName]: couponReducer,
  [codingEnablersModuleName]: codingEnablersReducer,
}

export default configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});