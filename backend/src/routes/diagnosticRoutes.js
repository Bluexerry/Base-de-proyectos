import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/diagnostic
router.get('/', async (req, res) => {
    try {
        // Estado del servidor
        const serverStatus = {
            status: 'online',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(process.uptime()),
            environment: process.env.NODE_ENV || 'development'
        };

        // Estado de la base de datos
        const dbConnected = mongoose.connection.readyState === 1;
        const dbStatus = {
            connected: dbConnected,
            host: dbConnected ? mongoose.connection.host : null,
            name: dbConnected ? mongoose.connection.name : null
        };

        // Ping a la base de datos si está conectada
        if (dbConnected) {
            await mongoose.connection.db.admin().ping();
            dbStatus.ping = 'success';
        }

        res.json({
            success: true,
            message: dbConnected ? 'Sistema funcionando correctamente' : 'Base de datos desconectada',
            server: serverStatus,
            database: dbStatus
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en diagnóstico',
            error: error.message
        });
    }
});

export default router;