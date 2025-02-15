import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ component: Component, adminOnly}) => {
    const { isAuthenticated, roles, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && !roles.includes('admin')) {
        return <Navigate to="/" replace />;
    }

    return <Component />;
};

export default ProtectedRoute;
