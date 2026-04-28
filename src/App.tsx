import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";

import DashboardPage from "./components/Dashboard/DashboardPage";
import DiagramEditorPage from "./components/Diagrams/DiagramEditorPage";
import LoginPage from "./components/Auth/Login";
import RegisterPage from "./components/Auth/RegisterPage";
import ProfilePage from "./components/Profile/Profile";
import LayoutWrapper from "./components/Layout/LayoutWrapper";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboardPage" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Wrap pages with LayoutWrapper for header/footer */}
          <Route
            path="/dashboardPage"
            element={
              <LayoutWrapper>
                <DashboardPage />
              </LayoutWrapper>
            }
          />
          {/* <Route
            path="/diagram/new"
            element={
              <LayoutWrapper>
                <DiagramEditorPage />
              </LayoutWrapper>
            }
          /> */}
          <Route
            path="/diagram/:id"
            element={
              <LayoutWrapper>
                <DiagramEditorPage />
              </LayoutWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <LayoutWrapper>
                <ProfilePage />
              </LayoutWrapper>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
