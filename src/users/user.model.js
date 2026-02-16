'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxLength: [50, 'El nombre de usuario no puede exceder 50 caracteres'],
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Email inválido'],
  },
  password: {
    type: String,
    required: true,
    minLength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseña
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);