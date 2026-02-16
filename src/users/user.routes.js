'use strict';

import { Router } from 'express';
import { registerUser, loginUser, updateProfile } from './user.controller.js';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

/* ==============================
   Middleware de autenticación
============================== */
const validateJWT = (req, res, next) => {
  try {
    const token = req.headers['authorization'];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No se proporcionó token'
      });
    }

    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }
};

/* ==============================
   Rutas públicas
============================== */

// Registrar usuario
router.post('/register', registerUser);

// Login usuario
router.post('/login', loginUser);


/* ==============================
   Rutas privadas (requieren JWT)
============================== */

// Actualizar perfil
router.put('/update/:id', validateJWT, updateProfile);


export default router;
