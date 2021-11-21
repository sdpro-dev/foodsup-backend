const mongoose = require('mongoose'),
Schema = mongoose.Schema;

const FoodItemSchema = new Schema({
    _id: String,
    address: String,
    company: Object,
    image: String,
    ingredients: String,
    instagram: String,
    name: String,
    price: Number,
    location: Object
});

mongoose.model('FoodItem', FoodItemSchema);