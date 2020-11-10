import mongoose from 'mongoose';

const itemOrderSchema = new mongoose.Schema({

    userID: {type: String, required: true},
    foodItemID: {type: String, required: true},
    quantity: {type: Number, required: true}

});

export default mongoose.model('ItemOrder', itemOrderSchema);