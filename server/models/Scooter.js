const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ScooterSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true,
        enum: ['Black', 'White', 'Red', 'Blue', 'Yellow', 'Green'],
        default: 'Black'
    },
    address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    }, 
    location: new Schema({
        coordinates: { type: [Number], required: true },
        type: { type: String, required: true }
    }),
    price: {
        type: Number,
        required: false
    },
    imageName: {
        type: String,
        required: false
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true
    },

})

module.exports = mongoose.model('Scooter', ScooterSchema);