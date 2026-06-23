import React from "react";

import ReactDOM from "react-dom/client";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App";

import Login from "./pages/Login";

import Register from "./pages/Register";

import ProfilePage from
  "./pages/ProfilePage";

import ActivityPage from
  "./pages/ActivityPage";

import ProtectedRoute from
  "./components/ProtectedRoute";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>

              <App />

            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>

              <ProfilePage />

            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute>

              <ActivityPage />

            </ProtectedRoute>
          }
        />
        <Route
  path="/register"
  element={<Register />}
 />
      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);