import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    address: {type: String, required: true},
    password: {type: String, required: true},
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
});

export default mongoose.model('User', userSchema);