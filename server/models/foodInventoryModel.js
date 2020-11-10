import mongoose from 'mongoose';

const foodBankInventory = new mongoose.Schema({

    foodBankID: { type: String, required: true },
    foodItemID: { type: String, required: true },
    quantity: { type: Number, required: true }

});

export default mongoose.model('FoodInventory', foodBankInventory);