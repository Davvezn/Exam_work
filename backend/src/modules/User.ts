import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    user_f_name: {type: String, required: true},
    user_l_name: {type: String, required: true},
    user_password: {type: String, required: true},
    user_email: {type: String, required: true},
    
    lastLogin: {
        type: Date,
        default: null,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {type: String, required: true}
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
export default User;