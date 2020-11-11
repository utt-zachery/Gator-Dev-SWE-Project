import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({

    expirationEpoch: {type: Number, required: true},
    quantity: {type: Number, required: true},
    foodItemID: {type: String, required: true},
    foodBankID: {type: String, required: true},
    donationID: {type: String, required: false},
    checkIn: {type: Boolean, required: true},
    location: {type: String, required: false}
    
});

export default mongoose.model('FoodInventory', inventorySchema);