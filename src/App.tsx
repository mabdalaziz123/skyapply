import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import UniversitiesPage from './pages/UniversitiesPage';
import BlogPage from './pages/BlogPage';
import UniversityDetail from './pages/UniversityDetail';
import BlogPost from './pages/BlogPost';
import ProgramsPage from './pages/ProgramsPage';

// Admin Imports
import AdminLayout from './components/Admin/AdminLayout';
import DashboardHome from './pages/Admin/DashboardHome';
import ManageUniversities from './pages/Admin/ManageUniversities';
import ManageBlog from './pages/Admin/ManageBlog';
import ManageFaculties from './pages/Admin/ManageFaculties';
import LoginPage from './pages/Admin/LoginPage';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ManageUsers from './pages/Admin/ManageUsers';

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <LanguageProvider>
            <AuthProvider>
                <Router>
                    <div className="min-h-screen">
                        <Routes>
                            {/* Admin Login (public) */}
                            <Route path="/admin/login" element={<LoginPage />} />

                            {/* Admin Routes (protected) */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<DashboardHome />} />
                                    <Route path="universities" element={<ManageUniversities />} />
                                    <Route path="blog" element={<ManageBlog />} />
                                    <Route path="faculties" element={<ManageFaculties />} />
                                    <Route path="users" element={<ManageUsers />} />
                                    <Route path="settings" element={<div className="text-right p-8">قريباً...</div>} />
                                </Route>
                            </Route>

                            {/* Public Routes */}
                            <Route path="/*" element={
                                <>
                                    <Navbar onOpenModal={openModal} />
                                    <main>
                                        <Routes>
                                            <Route path="/" element={<Home onOpenModal={openModal} />} />
                                            <Route path="/services" element={<ServicesPage onOpenModal={openModal} />} />
                                            <Route path="/universities" element={<UniversitiesPage onOpenModal={openModal} />} />
                                            <Route path="/programs" element={<ProgramsPage onOpenModal={openModal} />} />
                                            <Route path="/blog" element={<BlogPage onOpenModal={openModal} />} />
                                            <Route path="/university/:id" element={<UniversityDetail onOpenModal={openModal} />} />
                                            <Route path="/blog/:id" element={<BlogPost onOpenModal={openModal} />} />
                                        </Routes>
                                    </main>
                                    <Footer />
                                </>
                            } />
                        </Routes>

                        <ConsultationModal isOpen={isModalOpen} onClose={closeModal} />
                    </div>
                </Router>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
