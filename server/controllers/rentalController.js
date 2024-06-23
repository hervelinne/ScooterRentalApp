// controllers/rentalController.js
const Rental = require('../models/Rental');
const Scooter = require('../models/Scooter');
const User = require('../models/User'); 

const createRental = async (req, res) => {
    try {
        const { userId, scooterId, startTime, endTime} = req.body;
        const rental = new Rental({
            user: userId,
            scooter: scooterId, 
            startTime: startTime,
            endTime: endTime
        });

        await rental.save();

        //Update user and scooter models
        await User.findByIdAndUpdate(userId, { $push: { rentals: rental._id } });
        await Scooter.findByIdAndUpdate(scooterId, { $push: { rentals: rental._id } });

        res.status(201).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const endRental = async (req, res) => {
    try {
        const { id } = req.params;
        const { endTime, cost } = req.body;

        const rental = await Rental.findByIdAndUpdate(id, { endTime, cost }, { new: true });

        res.status(200).json(rental);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

const getRentals = async (req, res) => {
    try {
        const { userId } = req.params;
        const rentals = await Rental.find({ user: userId }).populate('scooter');

        res.status(200).json(rentals);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};


const getRentalsByScooter = async (req, res) => {
    try {
      const { scooterId } = req.params;
      const rentals = await Rental.find({ scooter: scooterId });
  
      res.status(200).json(rentals);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

// method to delete a rental
const deleteRental = async (req, res) => {
    try {
        const rentalId  = req.params.rentalId;
        // Find the rental
        const rental = await Rental.findById(rentalId);
        if (!rental) {
            return res.status(404).json({ message: 'Rental not found' });
        }

        // Remove the rental reference from the user and scooter
        await User.findByIdAndUpdate(rental.user, { $pull: { rentals: rental._id } });
        await Scooter.findByIdAndUpdate(rental.scooter, { $pull: { rentals: rental._id } });

        // Delete the rental
        await Rental.findByIdAndDelete(rentalId).exec();
        res.status(200).json({ message: 'Rental deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = { createRental, endRental, getRentals, deleteRental, getRentalsByScooter };
