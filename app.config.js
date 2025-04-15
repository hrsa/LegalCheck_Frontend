require('dotenv').config();

const getEnvVars = (env = process.env.APP_ENV) => {

    switch (env) {
        case 'production':
            return {
                environment: 'production',
                apiUrl: 'https://femida.app/api/',
                wsApiUrl: 'wss://femida.app/api/ws',
                debugRequests: false,
            };
        case 'staging':
            return {
                environment: 'staging',
                apiUrl: 'https://staging.femida.app/api/',
                wsApiUrl: 'wss://staging.femida.app/api/ws',
                debugRequests: true,
            };
        case 'development':
        default:
            return {
                environment: 'development',
                apiUrl: 'set in config.ts',
                wsApiUrl: 'set in config.ts',
                debugRequests: true,
            };
    }
};

const envVars = getEnvVars();

console.log('Using env vars:', envVars);

module.exports = {
    expo: {
        name: "Femida",
        slug: "Femida",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.hrsa.femida"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.hrsa.femida"
        },
        web: {
            bundler: "metro",
            favicon: "./assets/favicon.png",
            name: "Femida",
            output: "static"
        },
        plugins: [
            "expo-secure-store",
            "expo-router"
        ],
        extra: {
            apiUrl: envVars.apiUrl,
            wsApiUrl: envVars.wsApiUrl,
            debugRequests: envVars.debugRequests,
            environment: envVars.environment,
            eas: {
                projectId: "0366b772-e8ce-4af9-9f2b-227324341396"
            }
        }
    }
};

