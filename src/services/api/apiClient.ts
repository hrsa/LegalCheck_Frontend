import axios, {InternalAxiosRequestConfig} from "axios";
import {settings} from "./config";
import {getToken} from "./auth";

const apiClient = axios.create({
    baseURL: settings.API_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

if (settings.DEBUG_REQUESTS) {
    apiClient.interceptors.request.use(async request => {
            let dataToLog = request.data;

            if (request.data instanceof FormData) {
                dataToLog = {};

                request.data.forEach((value, key) => {
                    dataToLog[key] = value;
                });
            }
            console.log('[Axios Request Debug]', {
                method: request.method,
                baseUrl: request.baseURL ? request.baseURL : 'no base url',
                url: request.url ? request.url : 'no url',
                headers: request.headers,
                data: request.data,
                form_data: dataToLog ? dataToLog : 'no form data',
                platform: settings.MOBILE_PLATFORM ? 'mobile' : 'web',
            });

            return request;

        },
        error => Promise.reject(error)
    );

    apiClient.interceptors.response.use(
        response => {
            console.log('[Axios Response Debug]', {
                status: response.status,
                url: response.config.url,
                headers: response.headers,
                data: response.data,
            });
            return response;
        },
        error => {
            console.log('[Axios Response Error Debug]', {
                status: error.response?.status,
                url: error.response?.config?.url,
                headers: error.response?.headers,
                data: error.response?.data,
            });
            return Promise.reject(error);
        }
    );
}


if (settings.MOBILE_PLATFORM) {
    apiClient.interceptors.request.use(
        async (config: InternalAxiosRequestConfig) => {
            const token = await getToken();
            if (token && config.headers) {
                config.headers.Cookie = `legalcheck_access_token=${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );
}

export default apiClient;