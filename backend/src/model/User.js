import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Por favor proporciona un nombre'],
        trim: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Por favor proporciona un email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor proporciona un email válido']
    },
    password: {
        type: String,
        required: [true, 'Por favor proporciona una contraseña'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/*Hash de contraseña antes de guardar

el pre se ejecuta antes de guardar el documento, y 
el post se ejecuta después de guardar el documento. 
En este caso, queremos asegurarnos de que la contraseña 
esté hasheada antes de que el documento se guarde en la base 
de datos, por lo que utilizamos el pre.
*/
userSchema.pre('save', async function(next) {
/*
 verificar si la contraseña ha sido modificada.
 Esto es importante porque si el usuario actualiza 
 su información pero no cambia la contraseña, no queremos 
 volver a hashear la contraseña que ya está hasheada. 
 Si la contraseña no ha sido modificada, simplemente llamamos a next() 
 para continuar con el proceso de guardado sin hacer nada.
*/    
    if (!this.isModified('password')) {
        next();
    }
// Si la contraseña ha sido modificada, procedemos a hashearla.
//creamos una constante salt que genera un valor aleatorio para el hash de la contraseña.
    const salt = await bcrypt.genSalt(10);
//Luego, utilizamos bcrypt.hash para hashear la contraseña utilizando el salt generado.
    this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
//Este método se utiliza para comparar la contraseña 
// ingresada por el usuario con la contraseña hasheada almacenada en la base de datos.
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);