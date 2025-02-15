import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/register';
const ME_ENDPOINT = '/auth/me';
const LOGOUT_ENDPOINT = '/auth/logout';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}${ME_ENDPOINT}`, { withCredentials: true });
                setUser(response.data.user);
                setRoles(response.data.roles);
                setIsAuthenticated(true);
            } catch (err) {
                setUser(null);
                setRoles([]);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password, rememberMe) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${LOGIN_ENDPOINT}`,
                { email, password, rememberMe },
                { withCredentials: true }
            );
            setUser(response.data.user);
            setRoles(response.data.roles);
            setIsAuthenticated(true);
        } catch (err) {
            setError(err.response?.data || err.message);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, firstName, lastName, password, confirmPassword) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                `${API_BASE_URL}${REGISTER_ENDPOINT}`,
                { email, firstName, lastName, password, confirmPassword },
                { withCredentials: true }
            );
            setUser(response.data.user);
            setRoles(response.data.roles);
            setIsAuthenticated(true);
            return response.data;
        } catch (err) {
            setError(err.response?.data || err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(
                `${API_BASE_URL}${LOGOUT_ENDPOINT}`,
                {},
                { withCredentials: true }
            );
        } catch (err) {
            console.error('Ошибка при логауте', err);
        } finally {
            setUser(null);
            setRoles([]);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                roles,
                isAuthenticated,
                loading,
                error,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
