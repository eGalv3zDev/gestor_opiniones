import User from './user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Crear usuario
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Usuario o email ya existe' });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al registrar usuario', error: error.message });
  }
};

// Login usuario
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email o username

    const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ success: true, message: 'Login exitoso', data: { user, token } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al iniciar sesión', error: error.message });
  }
};

// Editar perfil
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, oldPassword, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    if (username) user.username = username;
    if (email) user.email = email;
    if (newPassword) {
      if (!oldPassword) return res.status(400).json({ success: false, message: 'Se requiere contraseña actual' });
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Contraseña actual incorrecta' });
      user.password = newPassword;
    }

    await user.save();

    res.status(200).json({ success: true, message: 'Perfil actualizado', data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al actualizar perfil', error: error.message });
  }
};
