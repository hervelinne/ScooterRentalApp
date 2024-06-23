const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const RentalSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scooter: {
        type: Schema.Types.ObjectId,
        ref: 'Scooter',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    cost: {
        type: Number
    }
})

module.exports = mongoose.model('Rental', RentalSchema);