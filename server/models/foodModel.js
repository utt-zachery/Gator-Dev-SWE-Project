import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({

    barcode: {type: Number, required: true},
    itemName: { type: String, required: true },
    quantity: {type: Number, required: true},

    hasNutrition: { type: Boolean, required: true },
    itemNutrition: { type: String, required: false },
    itemNutritionLabel: { type: String, required: false },

    hasImage: { type: Boolean, required: true },
    imageFileAddress:{type: String, required: false }

});

export default mongoose.model('FoodItem', foodSchema);