import mongoose from 'mongoose';

const foodBankSchema = new mongoose.Schema({

    name: { type: String, required: true },
    address: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    imageFileAddress:[String]

});

export default mongoose.model('c', foodBankSchema);