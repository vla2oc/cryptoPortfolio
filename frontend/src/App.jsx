import React from "react";
import AppLayout from "./components/AppLayout";
import Portfolio from "./pages/Portfolio";
import { CryptoContextProvider } from "../src/context/crypto-context";
import { Routes, Route } from "react-router-dom";
import AppAgent from "./pages/AppAgent";

export default function App() {
  return (
    <CryptoContextProvider>
      <Routes>
        <Route path="/aiagent" element={<AppAgent />} />
        <Route path="/dashboard" element={<AppLayout />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>
    </CryptoContextProvider>
  );
}
