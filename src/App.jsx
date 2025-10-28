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
import RecentActivitiesDialog from "./components/RecentActivitiesDialog";

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

import { MachineSelectionProvider } from "./MachineSelectionContext";
import VariantGallary from "./pages/VariantGallary";
import VariantGallaryView from "./pages/VariantGallaryView";

import {base_URL} from "./utils/api";
import { useKeyboardSafeView } from './hooks/useKeyboardSafeView';

function TokenWatcherWrapper() {
  const navigate = useNavigate();
  return <TokenWatcher navigate={navigate} />;
}

// Main App component
function App() {
  // useKeyboardSafeView();
  const navigate = useNavigate();
  const [recentDialogOpen, setRecentDialogOpen] = useState(false);

  const openRecentDialog = () => setRecentDialogOpen(true);
  const closeRecentDialog = () => setRecentDialogOpen(false);

  const [appliedLog, setAppliedLog] = useState(null);

  const onApplyLog = (log) => {
    console.log("🟢 App received applied log:", log);  
     if (window.location.pathname !== "/") {
      navigate("/");     
     } 
      setAppliedLog(log); 
  };
  const clearAppliedLog = () => setAppliedLog(null);

  return (
    <div className="app">
      <>
      <TokenWatcherWrapper />
      <AppSuccessAlert />
      <ResponsiveAppBar />
      <MachineSelectionProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                recentDialogOpen={recentDialogOpen}
                closeRecentDialog={closeRecentDialog}
                appliedLog={appliedLog}
                clearAppliedLog={clearAppliedLog}
              />
            }
          />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/machine/:id" element={<MachineDetailsPage />} />
          <Route path="/machine/:machineName" element={<MachineGallery />} />
          <Route path="/machine/:machineName/:machineId/variant/:variantName/:variantId" element={<VariantGallary />} />
          {/* <Route path="/machine/:machineId/variant/:variantId" element={<VariantGallaryView />} /> */}
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
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
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
      </MachineSelectionProvider>
      {/* <BasicSpeedDial /> */}

      <RecentActivitiesDialog
        open={recentDialogOpen}
        handleClose={closeRecentDialog}
        onApplyLog={onApplyLog}
      />

      <Footer onRecentOpen={openRecentDialog} onApplyLog={onApplyLog} />
    </>
    </div>
  );
}

export default App;

// Token expiry function with refresh support
function TokenWatcher({ navigate }) {
  useEffect(() => {
    const checkAndRefresh = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        const timeLeft = decoded.exp - now;

        if (timeLeft <= 0) {
          // expired → try refresh
          await attemptRefresh(navigate);
        } else {
          // schedule refresh 30s before expiry
          const timeout = setTimeout(async () => {
            await attemptRefresh(navigate);
          }, Math.max((timeLeft - 30) * 1000, 0));

          return () => clearTimeout(timeout);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/");
      }
    };

    checkAndRefresh();
  }, [navigate]);

  return null;
}

async function attemptRefresh(navigate) {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) throw new Error("No refresh token found");

    const res = await fetch(`${base_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }), // ✅ Correct key
    });

    if (!res.ok) throw new Error("Refresh request failed");

    const data = await res.json();

    if (data.access) {
      localStorage.setItem("access_token", data.access); // ✅ Correct field
      console.log("🟢 Token refreshed successfully");
      // No page reload needed
      return true;
    } else {
      throw new Error("No access token in response");
    }
  } catch (err) {
    console.error("🔴 Token refresh failed:", err);
    alert("Session expired. Please log in again.");
    localStorage.clear();
    navigate("/");
    return false;
  }
}