import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LogsPage from "../pages/logsPage/logs";
import HomePage from "../pages/homePage/homePage";
import Verify from "../components/verify/verify";
import { useAuth } from "../provider/authContext";
import ContactPage from "../pages/contact-page";
import GeneralApp from "../pages/chat-main/GeneralApp";

const MyRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated() ? <Navigate to="/home" /> : <LogsPage />}
      />
      <Route
        path="/home"
        element={isAuthenticated() ? <GeneralApp /> : <Navigate to="/" />}
      />
      <Route
        path="/groups/:id"
        element={isAuthenticated() ? <GeneralApp /> : <Navigate to="/" />}
      />
      <Route
        path="/contact"
        element={isAuthenticated() ? <ContactPage /> : <Navigate to="/" />}
      />
      <Route
        path="/verify"
        element={isAuthenticated() ? <Navigate to="/home" /> : <Verify />}
      />
    </Routes>
  );
};

export default MyRoutes;
