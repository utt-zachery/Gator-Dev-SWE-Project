import mongoose from 'mongoose';

const foodBankSchema = new mongoose.Schema({

    name: { type: String, required: true },
    address: { type: String, required: true },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    hours: {type: String, required: false},
    imageFileAddress:[String]

});

export default mongoose.model('FoodBank', foodBankSchema);