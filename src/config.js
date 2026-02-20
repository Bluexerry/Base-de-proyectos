import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/base_project',
    jwtSecret: process.env.JWT_SECRET || (() => { throw new Error('JWT_SECRET no está definido en las variables de entorno'); })(),

    // Email configuration
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS
};