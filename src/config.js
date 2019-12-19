require('dotenv').config();
module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
    JWT_SECRET: process.env.JWT_SECRET || 'recipebox-client-auth-token',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '10s'
};