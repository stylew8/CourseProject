import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TemplatePage from './pages/TemplatePage';
import UserDashboard from './pages/UserDashboard';
import AdminPage from './pages/AdminPage';
import CreateTemplatePage from './pages/CreateTemplatePage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import ThemeSwitcher from './components/ThemeSwitcher';
import EditFormPage from './pages/EditFormPage';
import EditTemplatePage from './pages/EditTemplatePage';

function App() {
    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="fw-bold">
                        Custom Forms
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="text-light">
                                Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/dashboard" className="text-light">
                                Dashboard
                            </Nav.Link>
                            <Nav.Link as={Link} to="/admin" className="text-light">
                                Admin
                            </Nav.Link>
                            <Nav.Link as={Link} to="/create-template" className="text-light">
                                Create Template
                            </Nav.Link>
                            <Nav.Link as={Link} to="/edit-page/1" className="text-light">
                                Edit Form
                            </Nav.Link>
                            <Nav.Link as={Link} to="/edit-template/1" className="text-light">
                                Edit Template
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <ThemeSwitcher />
                </Container>
            </Navbar>

            <Container className="mt-5">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<ProtectedRoute component={UserDashboard} />} />
                    <Route path="/template/:id" element={<ProtectedRoute component={TemplatePage} />} />
                    <Route path="/admin" element={<ProtectedRoute component={AdminPage} adminOnly={true} />} />
                    <Route path="/create-template" element={<ProtectedRoute component={CreateTemplatePage} />} />
                    <Route path="/edit-page/:formId" element={<ProtectedRoute component={EditFormPage} />} />
                    <Route path="/edit-template/:templateId" element={<ProtectedRoute component={EditTemplatePage} />} />
                </Routes>
            </Container>
        </Router>
    );
}

export default App;
