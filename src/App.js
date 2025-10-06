// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from "./contexts/UserContext";

import LoginPage from './pages/LoginPage';
import VerifyCode from './pages/VerifyCode';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import PlaceDetailPage from './pages/PlaceDetail';
import Profile from "./pages/Profile";
import CreatePlace from "./pages/CreatePlace";
import EditPlace from "./pages/EditPlace";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <Navbar />
        <main className="min-h-screen p-4">
          <Routes>
            {/* Page d’accueil */}
            <Route path="/" element={<HomePage />} />

            {/* Détails d’un lieu */}
            <Route path="/place/:id" element={<PlaceDetailPage />} />

            {/* Authentification */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-code" element={<VerifyCode />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Profil utilisateur */}
            <Route path="/profile" element={<Profile />} />

            {/* Création et modification de lieu */}
            <Route path="/places/new" element={<CreatePlace />} />
            <Route path="/places/:id/edit" element={<EditPlace />} />
            <Route path="/places/:id" element={<PlaceDetailPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
