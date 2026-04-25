import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProtectedAdminRoute from './components/auth/ProtectedAdminRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/home/Home';
import TestSelection from './pages/test/TestSelection';
import KlimovTest from './components/test/KlimovTest';
import KlimovResults from './components/test/KlimovResults';
import GolomshtokTest from './components/test/GolomshtokTest';
import GolomshtokResults from './components/test/GolomshtokResults';
import HollandTest from './components/test/HollandTest';
import HollandResults from './components/test/HollandResults';
import YovayshaTest from './components/test/YovayshaTest';
import YovayshaResults from './components/test/YovayshaResults';
import YovayshaLaTest from './components/test/YovayshaLaTest';
import YovayshaLaResults from './components/test/YovayshaLaResults';
import ComprehensiveTest from './components/test/ComprehensiveTest';
import ComprehensiveResults from './components/test/ComprehensiveResults';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/auth/Profile';
import TestHistory from './components/test/TestHistory';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminAnalytics from './components/admin/AdminAnalytics';
import SpecialtyManager from './components/admin/SpecialtyManager';
import CollegeManager from './components/admin/CollegeManager';
import ImportPage from './components/admin/ImportSpecialties'; 
import SpecialtiesPage from './pages/specialties/SpecialtiesPage';
import SpecialtyDetailPage from './pages/specialties/SpecialtyDetailPage';
import ComparePage from './pages/specialties/ComparePage';
import FavoritesPage from './pages/specialties/FavoritesPage';
import CollegesPage from './pages/colleges/CollegesPage';
import CollegeDetailPage from './pages/colleges/CollegeDetailPage';
import NearbyCollegesPage from './pages/colleges/NearbyCollegesPage';
import EssayAnalyzer from './components/ai/EssayAnalyzer';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6366f1',
        },
        secondary: {
            main: '#8b5cf6',
        },
        success: {
            main: '#10b981',
        },
        warning: {
            main: '#f59e0b',
        },
        error: {
            main: '#ef4444',
        },
        info: {
            main: '#3b82f6',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 800,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 700,
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 700,
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 700,
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                },
            },
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Router>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Header />
                        <ScrollToTop />
                        <main style={{ flex: 1 }}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/test" element={
                                    <ProtectedRoute>
                                        <TestSelection />
                                    </ProtectedRoute>
                                } />
                                <Route path="/specialties" element={<SpecialtiesPage />} />
                                <Route path="/specialties/compare" element={
                                    <ProtectedRoute>
                                        <ComparePage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/specialties/:id" element={<SpecialtyDetailPage />} />
                                <Route path="/favorites" element={
                                    <ProtectedRoute>
                                        <FavoritesPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/klimov" element={
                                    <ProtectedRoute>
                                        <KlimovTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/klimov/results" element={
                                    <ProtectedRoute>
                                        <KlimovResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/golomshtok" element={
                                    <ProtectedRoute>
                                        <GolomshtokTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/golomshtok/results" element={
                                    <ProtectedRoute>
                                        <GolomshtokResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/ai/essay" element={
  <ProtectedRoute>
    <EssayAnalyzer />
  </ProtectedRoute>
} />
                                <Route path="/test/holland" element={
                                    <ProtectedRoute>
                                        <HollandTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/holland/results" element={
                                    <ProtectedRoute>
                                        <HollandResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/colleges/:id" element={<CollegeDetailPage />} />
                                <Route path="/nearby" element={<NearbyCollegesPage />} />
                                <Route path="/test/yovaysha" element={
                                    <ProtectedRoute>
                                        <YovayshaTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/yovaysha/results" element={
                                    <ProtectedRoute>
                                        <YovayshaResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/yovayshala" element={
                                    <ProtectedRoute>
                                        <YovayshaLaTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/yovayshala/results" element={
                                    <ProtectedRoute>
                                        <YovayshaLaResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/comprehensive" element={
                                    <ProtectedRoute>
                                        <ComprehensiveTest />
                                    </ProtectedRoute>
                                } />
                                <Route path="/test/comprehensive/results" element={
                                    <ProtectedRoute>
                                        <ComprehensiveResults />
                                    </ProtectedRoute>
                                } />
                                <Route path="/colleges" element={<CollegesPage />} />
                                <Route path="/colleges/:id" element={<CollegeDetailPage />} />
                                <Route path="/test/history" element={
                                    <ProtectedRoute>
                                        <TestHistory />
                                    </ProtectedRoute>
                                } />
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin" element={
                                    <ProtectedAdminRoute>
                                        <AdminDashboard />
                                    </ProtectedAdminRoute>
                                } />
                                <Route path="/admin/analytics" element={
                                    <ProtectedAdminRoute>
                                        <AdminAnalytics />
                                    </ProtectedAdminRoute>
                                } />
                                <Route path="/admin/specialties" element={
                                    <ProtectedAdminRoute>
                                        <SpecialtyManager />
                                    </ProtectedAdminRoute>
                                } />
                                <Route path="/admin/colleges" element={
                                    <ProtectedAdminRoute>
                                        <CollegeManager />
                                    </ProtectedAdminRoute>
                                } />
                                <Route path="/admin/import" element={
                                    <ProtectedAdminRoute>
                                        <ImportPage />
                                    </ProtectedAdminRoute>
                                } />
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;