import User from '../model/User.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

const generateToken = (id) => {
    return jwt.sign({ id }, config.jwtSecret, { expiresIn: '7d' });
};

export const registerUser = async (name, email, password) => {
    if (!name || !email || !password) {
        throw new AppError('Por favor proporciona nombre, email y contrasena', 400, 'MISSING_FIELDS');
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        // Mensaje genérico para evitar enumeración de usuarios
        throw new AppError('No ha sido posible completar el registro. Verifica los datos e inténtalo de nuevo.', 400, 'REGISTER_FAILED');
    }
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    return {
        user: { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt },
        token
    };
};

export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    return user;
};

export const getAllUsers = async () => {
    return await User.find().select('-__v');
};

export const updateUser = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    return user;
};

export const loginUser = async (email, password) => {
    if (!email || !password) {
        throw new AppError('Por favor proporciona email y contrasena', 400, 'MISSING_FIELDS');
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Credenciales invalidas', 401, 'INVALID_CREDENTIALS');
    const isMatch = await user.matchPassword(password);
    if (!isMatch) throw new AppError('Credenciales invalidas', 401, 'INVALID_CREDENTIALS');
    const token = generateToken(user._id);
    return {
        user: { id: user._id, name: user.name, email: user.email },
        token
    };
};

export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    return user;
};

export default { registerUser, loginUser, getUserById, getAllUsers, updateUser, deleteUser };
