// import { useEffect } from 'react';
import { useSelector } from "react-redux";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import Layout from "./modules/common/components/layout";
import Users from "./modules/users/pages/users";
import Categories, {
  moduleName as CategoryModuleName,
} from "./modules/categories/pages/index.jsx";
import Authors, {
  moduleName as AuthorsModuleName,
} from "./modules/authors/pages/index.jsx";
import Coaches, {
  moduleName as CoachesModuleName,
} from "./modules/coaches/pages/index.jsx";
import {
  ListCoursePage,
  UpsertCourseBasicDetailsPage,
  moduleName as CourseModuleName,
} from "./modules/courses/pages";

import "./App.css";
import { UpsertBatchPage } from "./modules/courses/pages/upsert";

const App = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector((store) => store.auth.user);

  // if (!currentUser.id && location.pathname.includes("portal")) {
  //   return <Navigate to="/auth/login" state={{ from: location }} />;
  // }
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
          path={`${CourseModuleName}/batch/:courseId`}
          element={<UpsertBatchPage />}
        />
        <Route
          path={`${CourseModuleName}/module/:courseId`}
          element={<UpsertBatchPage />}
        />
        <Route
          path={`${CourseModuleName}/thumbnail/:courseId`}
          element={<UpsertBatchPage />}
        />

        <Route path="users" element={<Users />} />
        <Route path="users/:userId" element={<Users />} />
        {/*
          Using path="*"" means "match anything", so this route
          acts like a catch-all for URLs that we don't have explicit
          routes for.
        */}
      </Route>
      {/* <Route path="*" element={<p>404</p>} /> */}
    </Routes>
  );
};

export default App;
