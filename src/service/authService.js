import User from '../model/User.js';
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
import config from '../config.js';

// Generar JWT
const generateToken = (id) => {
    // El token se firma con el ID del usuario y una clave secreta,
    return jwt.sign({ id }, config.jwtSecret, {
    //  y tiene una expiración de 30 días.
        expiresIn: '30d'
    });
};

// Registrar usuario
export const registerUser = async (name, email, password) => {
    // Validar que todos los campos estén presentes
    // Si falta alguno de los campos, se lanza un error 
    // con un mensaje específico y un código de error.
    if (!name || !email || !password) {
        throw new AppError('Por favor proporciona nombre, email y contraseña', 400, 'MISSING_FIELDS');
    }

    // Verificar si el usuario ya existe
    // Antes de crear un nuevo usuario, se verifica si ya existe un usuario
    //  con el mismo email en la base de datos.
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError('El email ya está registrado', 400, 'EMAIL_EXISTS');
    }

    // Crear usuario
    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user._id);
// Si el usuario se crea correctamente, se devuelve un objeto
//  con la información del usuario y el token JWT.
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        },
        token
    };
};

// Obtener usuario por ID
export const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
    return user;
};

// Obtener todos los usuarios
export const getAllUsers = async () => {
    return await User.find();
};

// Actualizar usuario
export const updateUser = async (id, data) => {
    const user = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
    if (!user) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
    return user;
};

// Login usuario
export const loginUser = async (email, password) => {
    // Validar que los campos requeridos estén presentes
    if (!email || !password) {
        throw new AppError('Por favor proporciona email y contraseña', 400, 'MISSING_FIELDS');
    }

    // Buscar el usuario por email.
    // Se usa .select('+password') porque el campo password tiene select:false
    // en el modelo, es decir, no se devuelve por defecto en las consultas.
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        // Se usa el mismo mensaje para email y contraseña incorrectos
        // para no dar pistas de qué campo es incorrecto (seguridad).
        throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
    }

    // Comparar la contraseña ingresada con el hash guardado en la base de datos.
    // matchPassword está definido en el modelo User usando bcrypt.
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new AppError('Credenciales inválidas', 401, 'INVALID_CREDENTIALS');
    }

    // Si las credenciales son correctas, generar y devolver el token JWT.
    const token = generateToken(user._id);
    return {
        user: { id: user._id, name: user.name, email: user.email },
        token
    };
};

// Eliminar usuario
export const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError('Usuario no encontrado', 404, 'USER_NOT_FOUND');
    }
    return user;
};

export default {
    registerUser,
    loginUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
};