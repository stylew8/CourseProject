import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LOGIN_ENDPOINT = '/auth/login';
const REGISTER_ENDPOINT = '/auth/register';

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password, rememberMe }, { rejectWithValue }) => {
        try {
            // Обратите внимание на withCredentials, чтобы cookie передавались
            const response = await axios.post(
                `${API_BASE_URL}${LOGIN_ENDPOINT}`,
                { email, password, rememberMe },
                { withCredentials: true }
            );
            // Ожидаем, что сервер вернёт объект вида { user, roles }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async ({ email, firstName, lastName, password, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}${REGISTER_ENDPOINT}`,
                { email, firstName, lastName, password, confirmPassword },
                { withCredentials: true }
            );
            // Если сервер после регистрации сразу возвращает данные,
            // то их можно использовать, иначе просто вернуть ответ (например, сообщение)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    user: null,
    roles: [],
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.roles = [];
            state.isAuthenticated = false;
        },
        setCredentials(state, action) {
            // Ожидаем, что payload имеет формат: { user, roles }
            const { user, roles } = action.payload;
            state.user = user;
            state.roles = roles;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                // Обновляем состояние на основе данных, полученных от сервера
                state.user = action.payload.user;
                state.roles = action.payload.roles;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка авторизации';
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
                // После регистрации можно дополнительно обновить состояние,
                // если сервер возвращает данные, или оставить как есть.
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка регистрации';
            });
    },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
