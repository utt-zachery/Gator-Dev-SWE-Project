import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    bagState: {type: Number, required: true},
    placedBy: {type: String, required: true},
    orderTime: {type: String, required: true},
    pickupTime: {type: String, required: true}

});

export default mongoose.model('Order', orderSchema);