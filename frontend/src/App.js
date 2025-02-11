import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
// import TemplateCard from './components/TemplateCard';
// import TagCloud from './components/TagCloud';
// import FormList from './components/FormList';

function App() {
    return (
        <Router>
            <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
                <Container>
                    <Navbar.Brand href="/" className="fw-bold">Custom Forms</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/" className="text-light">Home</Nav.Link>
                            <Nav.Link href="/dashboard" className="text-light">Dashboard</Nav.Link>
                            <Nav.Link href="/admin" className="text-light">Admin</Nav.Link>
                            <Nav.Link href="/create-template" className="text-light">Create Template</Nav.Link>
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
                </Routes>
            </Container>
        </Router>
    );
}

export default App;