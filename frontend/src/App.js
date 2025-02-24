import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import HeaderSearch from './components/Search/HeaderSearch';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TemplatePage from './pages/TemplatePage';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';
import CreateTemplatePage from './pages/CreateTemplatePage';
import EditFormPage from './pages/EditFormPage';
import EditTemplatePage from './pages/EditTemplatePage';

import ProtectedRoute from './components/ProtectedRoute';
import ThemeSwitcher from './components/ThemeSwitcher';

import { ToastContainer } from 'react-toastify';
import { AuthContext } from './context/AuthContext';
import PublicRoute from './components/PublicRoute';
import { Admin } from './api/roles';
import './App.css';
import SearchPage from './pages/SearchPage';

function App() {
    const { isAuthenticated, logout, roles } = useContext(AuthContext);

    return (
        <Router>
            <Navbar bg="light" variant="light" expand="lg" className="shadow">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold" >
                        Custom Forms
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {isAuthenticated && (
                                <Nav>
                                    <Nav.Link as={Link} to="/dashboard" className="text-dark">
                                        Dashboard
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/create-template" className="text-dark">
                                        Create template
                                    </Nav.Link>
                                </Nav>
                            )}
                            {roles.includes(Admin) && (
                                <Nav.Link as={Link} to="/admin" className="text-dark">
                                    Admin
                                </Nav.Link>
                            )}
                        </Nav>
                            <ThemeSwitcher />
                        <Nav className='mx-5'>
                                <HeaderSearch />
                                {isAuthenticated ? (
                                    <Nav.Link onClick={logout} className="text-danger">
                                        Logout
                                    </Nav.Link>
                                ) : (
                                    <>
                                        <Nav.Link as={Link} to="/login" className="text-dark">
                                            Login
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/register" className="text-dark">
                                            Register
                                        </Nav.Link>
                                    </>
                                )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="mt-5">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<PublicRoute component={LoginPage} />} />
                    <Route path="/register" element={<PublicRoute component={RegisterPage} />} />
                    <Route path="/dashboard" element={<ProtectedRoute component={UserDashboard} />} />
                    <Route path="/template/:id" element={<TemplatePage />} />
                    <Route path="/admin" element={<ProtectedRoute component={AdminPage} adminOnly={true} />} />
                    <Route path="/create-template" element={<ProtectedRoute component={CreateTemplatePage} />} />
                    <Route path="/edit-form/:formId" element={<ProtectedRoute component={EditFormPage} />} />
                    <Route path="/edit-template/:templateId" element={<ProtectedRoute component={EditTemplatePage} />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Container>

            <ToastContainer 
            position="top-right" 
            autoClose={5000} 
            hideProgressBar={false} 
            newestOnTop={false} 
            closeOnClick 
            rtl={false} 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover
            />
            
        </Router>
    );
}

export default App;
