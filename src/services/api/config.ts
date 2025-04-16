import {Platform} from "react-native";
import Constants from 'expo-constants';

const MOBILE_PLATFORM = Platform.OS === "android" || Platform.OS === "ios";

// Get values from app.config.js
const extraConfig = Constants.expoConfig?.extra || {};

// Fallback to original values if config is not available
const LOCAL_API_URL =
    MOBILE_PLATFORM ? "http://192.168.2.2:800/api/" : "http://localhost:800/api/";

const LOCAL_WS_API_URL =
    MOBILE_PLATFORM ? "ws:/192.168.2.2:800/api/ws" : "ws:/localhost:800/api/ws";

export const settings = {
    MOBILE_PLATFORM: MOBILE_PLATFORM,
    API_URL: extraConfig.environment === 'development' ? LOCAL_API_URL : extraConfig.apiUrl,
    WS_API_URL: extraConfig.environment === 'development' ? LOCAL_WS_API_URL : extraConfig.wsApiUrl,
    DEBUG_REQUESTS: extraConfig.debugRequests !== undefined ? extraConfig.debugRequests : true,
    ENVIRONMENT: extraConfig.environment || 'development'
};
