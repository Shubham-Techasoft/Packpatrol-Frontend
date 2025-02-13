import React, { useState } from "react";
import ResponsiveAppBar from "./components/Header";
import BasicSpeedDial from './components/BasicSpeedDial';
import Footer from './components/Footer';
import BasicGrid from './components/PageContainer';
import AppSuccessAlert from './components/alerts';

function App() {
  return (
    <div>
      <AppSuccessAlert />
      <ResponsiveAppBar />
      <BasicGrid />
      <Footer />
      <BasicSpeedDial />
    </div>
  );
}

export default App
