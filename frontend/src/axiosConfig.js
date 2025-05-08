import axios from "axios";
import { logout, getRefreshToken, setAccessToken } from "./utils/auth";

const client = axios.create({
    baseURL: process.env.REACT_APP_API,
});

client.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) throw new Error("No hay refresh token disponible.");

                const response = await axios.post(`${process.env.REACT_APP_API}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                setAccessToken(response.data.access);

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return client(originalRequest);
            } catch (refreshError) {
                console.error("No se pudo refrescar el token, cerrando sesión...");
                logout();
            }
        }

        return Promise.reject(error);
    }
);

export default client;