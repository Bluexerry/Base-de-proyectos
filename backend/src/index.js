import app from './app.js';
import config from './config.js';
import connectDB from './loaders/mongoDB.js';

const startServer = async () => {
    try {
        // Conectar a MongoDB
        await connectDB();
        
        // Iniciar servidor
        app.listen(config.port, () => {
            console.log(`✅ Servidor funcionando en puerto ${config.port}`);
            console.log(`🌍 Entorno: ${config.nodeEnv}`);
            console.log(`🔗 URL: http://localhost:${config.port}`);
        });

    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

startServer();