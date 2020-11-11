import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    bagState: {type: Number, required: true},
    placedBy: {type: String, required: true},
    orderTime: {type: Number, required: true},
    pickupTime: {type: Number, required: false},
    foodBankID: {type: String, required: true}

});

export default mongoose.model('Order', orderSchema);