import mongoose from 'mongoose';

const managesSchema = new mongoose.Schema({

    userID: {type: String, required: true},
    foodBankID: {type: String, required: true}

});

export default mongoose.model('Manages', managesSchema);