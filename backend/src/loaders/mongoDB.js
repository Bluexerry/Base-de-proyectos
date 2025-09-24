import mongoose from 'mongoose';
import config from '../config.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoURI);
        console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ Error conectando a MongoDB: ${error.message}`);
        throw error;
    }
};

export default connectDB;