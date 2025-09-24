import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/base_project',
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key'
};