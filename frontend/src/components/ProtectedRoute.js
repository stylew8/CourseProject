import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, adminOnly, ...rest }) => {
    const isAuthenticated = true; // zatichka
    const isAdmin = true; 

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;