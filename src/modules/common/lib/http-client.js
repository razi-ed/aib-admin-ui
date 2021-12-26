import Axios from "axios";
import { authTokensStoragKeys } from "../constants/auth.constants";

export const httpOpenClient = Axios.create({
    baseURL: process.env.REACT_APP_API,
    timeout: 1000 * 15,
});

const httpClient = Axios.create({
    baseURL: process.env.REACT_APP_API,
    timeout: 1000 * 15,
});

const assetHttpClient = Axios.create({
    baseURL: process.env.REACT_APP_ASSET_API,
    timeout: 1000 * 15,
});

function addAuthHeaderToRequest(config) {

    const serializedAccessToken = window.localStorage.getItem(authTokensStoragKeys.ACCESS)
    const deserializedAccessToken = window.atob(serializedAccessToken);
    const accessToken = deserializedAccessToken ? JSON.parse(deserializedAccessToken) : {};

    if (!accessToken.token) {
      return {
        ...config,
        // withCredentials: true,
        headers: {
          ...config.headers,
        },
      };
    }
  
    return {
        ...config,
        // withCredentials: true,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken.token}`,
        },
    };
};

const errorHandler = error => {
    if (error.response.status === 403) {
        window.localStorage.removeItem(authTokensStoragKeys.ACCESS)
        window.localStorage.removeItem(authTokensStoragKeys.REFRESH)
        window.location.href = '/auth/login';
    }
    if (error.response.status === 401) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
            const serializedRefreshToken = window.localStorage.getItem(authTokensStoragKeys.REFRESH);
            const deserializedRefreshToken = window.atob(serializedRefreshToken);
            const refreshToken = deserializedRefreshToken ? JSON.parse(deserializedRefreshToken) : null;
            const now = Date.now();
            if (refreshToken && refreshToken.token && refreshToken.expires && now < new Date(refreshToken.expires)) {
                originalRequest._retry = true;
                return Axios.post(`${process.env.REACT_APP_API}/auth/refresh-tokens`, { refreshToken: refreshToken.token })
                .then(({data}) => {
                    const serializedAccessToken = window.btoa(JSON.stringify(data.access));
                    const serializedRefreshToken = window.btoa(JSON.stringify(data.refresh));
                    window.localStorage.setItem(authTokensStoragKeys.ACCESS, serializedAccessToken)
                    window.localStorage.setItem(authTokensStoragKeys.REFRESH, serializedRefreshToken)
                    originalRequest.headers['Authorization'] = 'Bearer ' + data.access.token;
                    return Axios(originalRequest);
                });
            }
        }
        window.localStorage.removeItem(authTokensStoragKeys.ACCESS)
        window.localStorage.removeItem(authTokensStoragKeys.REFRESH)
        window.location.href = '/auth/login';
    }
    return Promise.reject(error);
};

  
httpClient.interceptors.request.use(
    addAuthHeaderToRequest,
    undefined
);

httpClient.interceptors.response.use(
    undefined,
    errorHandler,
);

assetHttpClient.interceptors.request.use(
    addAuthHeaderToRequest,
    undefined
);

assetHttpClient.interceptors.response.use(
    undefined,
    errorHandler,
);

export default httpClient;

export { assetHttpClient };