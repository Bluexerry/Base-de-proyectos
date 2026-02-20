import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Por favor proporciona un email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Por favor proporciona un email válido']
    },
    hashSubscription: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Newsletter', newsletterSchema);