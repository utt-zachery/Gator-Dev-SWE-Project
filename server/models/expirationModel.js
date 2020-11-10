import mongoose from 'mongoose';

const exiprationSchema = new mongoose.Schema({

    expirationEpoch: {type: Number, required: true},
    quantity: {type: Number, required: true},
    foodItemID: {type: String, required: true},
    foodBankID: {type: String, required: true}
});

export default mongoose.model('ExpirationTracker', exiprationSchema);