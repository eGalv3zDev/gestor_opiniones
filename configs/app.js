'use strict';

// Importaciones
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { corsOptions } from './cors-configuration.js';
import { dbConnection } from './db.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import { errorHandler } from '../middlewares/handle-errors.js';
import User from '../src/users/user.model.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const BASE_URL = '/kinalOpinion/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

// -------------------------
// Funciones de autenticación
// -------------------------
const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
        .toString('hex');
    return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
    const [salt, originalHash] = stored.split(':');
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
        .toString('hex');
    return hash === originalHash;
};

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
};

// -------------------------
// Middleware para proteger rutas
// -------------------------
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ msg: 'No autorizado' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: 'Token inválido' });
    }
};

// -------------------------
// Configuración de middlewares
// -------------------------
const middlewares = (app) => {
    app.use(helmet(helmetConfiguration));
    app.use(cors(corsOptions));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(requestLimit);
    app.use(morgan('dev'));
};

// -------------------------
// Inicialización del servidor
// -------------------------
const initServer = async (app) => {
    // Creación de la instancia de la aplicación
    app = express();
    const PORT = process.env.PORT || 3001;

    try {
        dbConnection();
        middlewares(app);

        // -------------------------
        // Rutas
        // -------------------------

        // Health check
        app.get(`${BASE_URL}/health`, (req, res) => { 
            res.status(200).json({
                status: 'ok',
                service: 'KinalOpinion',
                version: '1.0.0'
            });
        });

        // Registro
        app.post(`${BASE_URL}/auth/register`, async (req, res) => {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
            }

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) return res.status(400).json({ msg: 'Usuario ya registrado' });

                const hashedPassword = hashPassword(password);
                const newUser = new User({ username, email, password: hashedPassword });
                await newUser.save();

                const token = generateToken(newUser);
                res.status(201).json({ token, user: { id: newUser._id, username, email } });
            } catch (err) {
                console.error(err);
                res.status(500).json({ msg: 'Error en el servidor' });
            }
        });

        // Login
        app.post(`${BASE_URL}/auth/login`, async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
            }

            try {
                const user = await User.findOne({ email });
                if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

                const isValid = verifyPassword(password, user.password);
                if (!isValid) return res.status(400).json({ msg: 'Contraseña incorrecta' });

                const token = generateToken(user);
                res.json({ token, user: { id: user._id, username: user.username, email } });
            } catch (err) {
                console.error(err);
                res.status(500).json({ msg: 'Error en el servidor' });
            }
        });

        // Ejemplo de ruta protegida
        app.get(`${BASE_URL}/protected`, verifyToken, (req, res) => {
            res.json({ msg: `Hola ${req.user.username}, estás autorizado!` });
        });

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Base URL: http://localhost:${PORT}${BASE_URL}`);
        });

    } catch (error) {
        console.log(error);
    }
};

export { initServer };