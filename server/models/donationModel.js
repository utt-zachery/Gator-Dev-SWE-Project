import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({

    userID: {type: String, required: true},
    quantity: {type: Number, required: true},
    foodItemID: {type: String, required: true},
    donationDate: {type: Number, required: true}

});

export default mongoose.model('Donation', donationSchema);