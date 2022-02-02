// import { useEffect } from 'react';
import { useSelector } from "react-redux";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import AuthLayout from './modules/auth/components/auth-layout';
import LoginPage from './modules/auth/pages/login';
import Layout from './modules/common/components/layout';
import Users from './modules/users/pages/users';
import Categories, { moduleName as CategoryModuleName } from './modules/categories/pages/index.jsx';
import Authors, { moduleName as AuthorsModuleName } from './modules/authors/pages/index.jsx';
import Coaches, { moduleName as CoachesModuleName } from './modules/coaches/pages/index.jsx';
import CodingEnablers, { moduleName as CodingEnablersModuleName } from './modules/coding-enablers/pages/index.jsx';

import ContactUs, { moduleName as ContactUsModuleName } from './modules/contactUs/pages/index.jsx';
import HireStudent, { moduleName as HireStudentModuleName } from './modules/hireStudent/pages/index.jsx';
import EmailEnquiry, { moduleName as EmailEnquiryModuleName } from './modules/emailEnquiry/pages/index.jsx';
import Webinars, { moduleName as WebinarsModuleName } from './modules/webinars/pages/index.jsx';
import Student, { moduleName as StudentModuleName } from './modules/student/pages/index.jsx';
import Coupon, { moduleName as CouponModuleName } from './modules/coupon/pages/index.jsx';

import {
  ListCoursePage,
  UpsertCourseBasicDetailsPage,
  UpsertCourseBatchDetailsPage,
  UpsertCourseModulesDetailsPage,
  moduleName as CourseModuleName,
} from "./modules/courses/pages";

import "./App.css";

const App = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((store) => store.auth.user);

  if (!currentUser.id && location.pathname.includes("portal")) {
    console.log({currentUser, path: location.pathname});
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  // useEffect(() => {
  //   if (!currentUser.id && location.pathname.includes('/portal')) {
  //     navigate("/auth/login", { replace: true, state:{ from: location } });
  //   }
  // }, [currentUser.id, navigate, location])

  return (
    <Routes>
      <Route path="/portal" element={<Layout />}>
        <Route index element={<p>home</p>} />

        <Route path={`${CategoryModuleName}`} element={<Categories />} />
        <Route path={`${CategoryModuleName}/:keyId`} element={<Categories />} />

        <Route path={`${AuthorsModuleName}`} element={<Authors />} />
        <Route path={`${AuthorsModuleName}/:keyId`} element={<Authors />} />

        <Route path={`${CoachesModuleName}`} element={<Coaches />} />
        <Route path={`${CoachesModuleName}/:keyId`} element={<Coaches />} />

        <Route path={`${CodingEnablersModuleName}`} element={<CodingEnablers />} />
        <Route path={`${CodingEnablersModuleName}/:keyId`} element={<CodingEnablers />} />

        <Route path={`${CourseModuleName}/list`} element={<ListCoursePage />} />
        <Route
          path={`${CourseModuleName}/create`}
          element={<UpsertCourseBasicDetailsPage />}
        />
        <Route
          path={`${CourseModuleName}/basic/:courseId`}
          element={<UpsertCourseBasicDetailsPage />}
        />
        <Route
          path={`${CourseModuleName}/batch/:slug/:courseId`}
          element={<UpsertCourseBatchDetailsPage />}
        />
        
        <Route
          path={`${CourseModuleName}/module/:slug/:courseId/:moduleId/:moduleType/:sectionId`}
          element={<UpsertCourseModulesDetailsPage />}
        />
        <Route
          path={`${CourseModuleName}/module/:slug/:courseId/:moduleId/:moduleType`}
          element={<UpsertCourseModulesDetailsPage />}
        />
        <Route
          path={`${CourseModuleName}/module/:slug/:courseId/:moduleId`}
          element={<UpsertCourseModulesDetailsPage />}
        />
        <Route
          path={`${CourseModuleName}/module/:slug/:courseId`}
          element={<UpsertCourseModulesDetailsPage />}
        />
        <Route path={`${ContactUsModuleName}`} element={<ContactUs />} />
        <Route path={`${ContactUsModuleName}/:keyId`} element={<ContactUs />} />

        <Route path={`${HireStudentModuleName}`} element={<HireStudent />} />
        <Route path={`${HireStudentModuleName}/:keyId`} element={<HireStudent />} />

        <Route path={`${EmailEnquiryModuleName}`} element={<EmailEnquiry />} />
        <Route path={`${EmailEnquiryModuleName}/:keyId`} element={<EmailEnquiry />} />

        <Route path={`${WebinarsModuleName}`} element={<Webinars />} />
        <Route path={`${WebinarsModuleName}/:keyId`} element={<Webinars />} />

        <Route path={`${StudentModuleName}`} element={<Student />} />
        <Route path={`${StudentModuleName}/:keyId`} element={<Student />} />
        
        <Route path={`${CouponModuleName}`} element={<Coupon />} />
        <Route path={`${CouponModuleName}/:keyId`} element={<Coupon />} />

        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<Users />} />




        {/*
          Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for.
        */}
        <Route path="*" element={<p>home</p>} />
      </Route>
      <Route path="/auth" element={<AuthLayout />} >
        <Route path="login" element={<LoginPage />} />
        {/*
          Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for.
        */}
        <Route path="*" element={<p>404</p>} />
      </Route>
      <Route path="*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};

export default App;
