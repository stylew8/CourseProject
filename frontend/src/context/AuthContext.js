import React, { createContext, useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosInstance'

export const AuthContext = createContext();

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
                const response = await axiosInstance.get(`${ME_ENDPOINT}`);
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
            const response = await axiosInstance.post(
                `${LOGIN_ENDPOINT}`,
                { email, password, rememberMe }
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
            const response = await axiosInstance.post(
                `${REGISTER_ENDPOINT}`,
                { email, firstName, lastName, password, confirmPassword }
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
            await axiosInstance.post(
                `${LOGOUT_ENDPOINT}`
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
