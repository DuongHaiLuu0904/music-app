import mongoose from 'mongoose';
import * as generate from '../helpers/generate';

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: () => generate.generateRandomString(32) 
    },
    phone: String,
    avatar: String,
    status: {
        type: String,
        default: 'active'
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deleteAt: Date
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema, 'users');
export default User;