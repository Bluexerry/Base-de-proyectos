import express from 'express';
import configureExpress from './loaders/express.js';

// Crear aplicación Express
const app = express();

// Configurar Express usando el loader
configureExpress(app);

export default app;