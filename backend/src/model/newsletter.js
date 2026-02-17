import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
email:{
    type: String,
    required: [true, 'Por favor proporciona un email'],
    unique: true,
},

hashSubscription: {
    type: Boolean,
    default: false
},

updateAt: {
    type: Date,
    default: Date.now
},

createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Newsletter', newsletterSchema);