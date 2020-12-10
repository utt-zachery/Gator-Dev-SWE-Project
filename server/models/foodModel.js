import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({

    barcode: {type: Number, required: true},
    itemName: { type: String, required: true },
    hasNutrition: { type: Boolean, required: true },
    itemNutrition: { type: Number, required: false },
    itemNutritionLabel: { type: String, required: false },

    hasImage: { type: Boolean, required: true },
    imageAddress:{type: String, required: false }

});

export default mongoose.model('FoodItem', foodSchema);