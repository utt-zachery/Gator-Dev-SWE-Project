import mongoose from 'mongoose';

const foodBankSchema = new mongoose.Schema({

    id: {type: Number, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    imageFileAddress:[String]

});

export default mongoose.model('foodBank', foodBankSchema);