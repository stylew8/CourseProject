// src/api.js
import axios from 'axios';
import { store } from './redux/store';
import { logout, removeAdminPrivileges } from './redux/authSlice'; // пример: экшен для обновления прав

const api = axios.create({
    baseURL: '/api', // укажите ваш базовый URL
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                // Сброс состояния авторизации, если 401 Unauthorized
                store.dispatch(logout());
            } else if (status === 403) {
                // Если 403 Forbidden, например, можно обновить состояние, чтобы убрать права администратора
                store.dispatch(removeAdminPrivileges());
                // Или, если нужно, можно перенаправить пользователя на страницу "Нет доступа"
                //window.location.href = '/forbidden';
                console.warn("Access forbidden: the user doesn't have sufficient permissions.");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
