import mongoose from 'mongoose';

const itemOrderSchema = new mongoose.Schema({

    foodItemID: {type: String, required: true},
    quantity: {type: Number, required: true},
    orderModelID: {type: String, required: true}
    
});

export default mongoose.model('ItemOrder', itemOrderSchema);