// import React, { useState } from "react";
// import ResponsiveAppBar from "./components/Header";
// import BasicSpeedDial from './components/BasicSpeedDial';
// import Footer from './components/Footer';
// import BasicGrid from './components/PageContainer';
// import AppSuccessAlert from './components/alerts';

// function App() {
//   return (
//     <div>
//       <AppSuccessAlert />
//       <ResponsiveAppBar />
//       <BasicGrid />
//       <Footer />
//       <BasicSpeedDial />
//     </div>
//   );
// }

// export default App

// create proper routing using react-router-dom
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ResponsiveAppBar from "./components/Header";
import Footer from "./components/Footer";
import BasicSpeedDial from "./components/BasicSpeedDial";
import AppSuccessAlert from "./components/alerts";
import GalleryPage from "./pages/GalleryPage";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import MachineGallery from "./pages/MachineGallery";
import DeveloperSettingsPage from "./pages/DeveloperSettingsPage";

function App() {
  return (
    <Router>
      <AppSuccessAlert />
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/machine/:machineName" element={<MachineGallery />} />
        <Route path="/dev-settings" element={<DeveloperSettingsPage />} />
      </Routes>
      <BasicSpeedDial />
      <Footer />
    </Router>
  );
}

export default App;
