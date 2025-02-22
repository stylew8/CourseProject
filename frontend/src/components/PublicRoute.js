import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PublicRoute = ({ component: Component }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated) {
        const redirectPath = location.state?.from?.pathname || '/';
        return <Navigate to={redirectPath} replace />;
    }

    return <Component />;
};

export default PublicRoute;
