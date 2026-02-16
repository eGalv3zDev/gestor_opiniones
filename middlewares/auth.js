import jwt from 'jsonwebtoken';
import User from '../modules/users/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Middleware para proteger rutas
export const authMiddleware = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ success: false, message: 'No token proporcionado' });

    const token = authHeader.split(' ')[1];

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // excluir contraseña

    if (!user) return res.status(401).json({ success: false, message: 'Usuario no encontrado' });

    req.user = { id: user._id, username: user.username, email: user.email }; // disponible en req.user
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido', error: error.message });
  }
};