import {Platform} from "react-native";

const MOBILE_PLATFORM = Platform.OS === "android" || Platform.OS === "ios";

const LOCAL_API_URL =
    MOBILE_PLATFORM ? "http://192.168.2.2:8000/api/v1/" : "http://localhost:8000/api/v1/";

export const settings = {
    MOBILE_PLATFORM: MOBILE_PLATFORM,
    API_URL: LOCAL_API_URL,
    DEBUG_REQUESTS: true
};