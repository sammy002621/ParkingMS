/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { CommonContext } from "@/context";
import Layout from "@/layout/Layout";
import Profile from "@/pages/profile/Profile";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
const Login = React.lazy(() => import("@/pages/auth/login/Login"));
const Signup = React.lazy(() => import("@/pages/auth/signup/Signup"));
const NotFound = React.lazy(() => import("@/pages/400/NotFound"));
const Home = React.lazy(() => import("@/pages/home/Home"));

const PagesRouter: React.FC<{}> = () => {
  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;
  const { isLoggedIn } = useContext(CommonContext);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route
            path={`/`}
            element={isLoggedIn ? <Home /> : <Navigate to={"/auth/login"} />}
          />
          <Route
            path={`/${role.toLowerCase()}/profile`}
            element={isLoggedIn ? <Profile /> : <Navigate to={"/auth/login"} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default PagesRouter;
