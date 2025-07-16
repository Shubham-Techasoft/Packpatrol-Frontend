import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ResponsiveAppBar from "./components/Header";
import Footer from "./components/Footer";
// import BasicSpeedDial from "./components/BasicSpeedDial";
import AppSuccessAlert from "./components/alerts";
import GalleryPage from "./pages/GalleryPage";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import MachineGallery from "./pages/MachineGallery";
import DeveloperSettingsPage from "./pages/DeveloperSettingsPage";
import MachineDetailsPage from "./pages/MachineDetailsPage";
import FolderTree from "./components/FolderTree";
import ProfilePage from "./components/Profile";
import UsersPage from "./pages/UsersPage";

import { isAuthenticated, isPrivilegedUser } from "./utils/auth";
import ProtectedRoute from "./components/ProtectedRoute";

function TokenWatcherWrapper() {
  const navigate = useNavigate();
  return <TokenWatcher navigate={navigate} />;
}



// Main App component
function App() {

  const [recentDialogOpen, setRecentDialogOpen] = useState(false);
  const openRecentDialog = () => setRecentDialogOpen(true);
  const closeRecentDialog = () => setRecentDialogOpen(false);

  const onApplyLog = (log) => {
    console.log("🟢 App received applied log:", log);
    // Forward this to Home or handle it here
  };

  
  return (
    <Router>
      <TokenWatcherWrapper />
      <AppSuccessAlert />
      <ResponsiveAppBar />
      <Routes>

        <Route 
        path="/" 
        element={
          <Home 
            recentDialogOpen={recentDialogOpen}
            closeRecentDialog={closeRecentDialog}
            onApplyLog={onApplyLog}
          />
        } 
        />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/machine/:id" element={<MachineDetailsPage />} />
        <Route path="/machine/:machineName" element={<MachineGallery />} />
        <Route path="/folder-structure" element={<FolderTree />} />

        {/* dev settings page */}
        <Route
          path="/dev-settings"
          element={
            <ProtectedRoute>
              <DeveloperSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/profile" 
          element={
          <ProfilePage />
          } 
        />

        <Route 
          path="/users" 
          element={
            <ProtectedRoute requireSuperAdmin>
              <UsersPage />
            </ProtectedRoute>
            } 
        />

      </Routes>
      {/* <BasicSpeedDial /> */}

      <Footer 
        onRecentOpen={openRecentDialog} 
        onApplyLog={onApplyLog}
      />
    </Router>
  );
}

export default App;

// Token expiry function
function TokenWatcher({ navigate }) {
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/");
      } else {
        const timeLeft = decoded.exp - now;
        const timeout = setTimeout(() => {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate("/");
        }, timeLeft * 1000);

        return () => clearTimeout(timeout); // Cleanup
      }
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, [navigate]);

  return null;
}
