const User = require('../models/User');
const Rental = require('../models/Rental');
const Scooter = require('../models/Scooter');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

async function getUserRentals(req, res) {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;

  try {
    // Find total count of rentals for the user
    const totalCount = await Rental.countDocuments({ user: userId });

    // Find rentals of the user with pagination, populate scooter and include start and end time
    const rentedScooters = await Rental.find({ user: userId })
      .skip(startIndex)
      .limit(limit)
      .populate({
        path: 'scooter',
        select: 'brand color price -_id', // Example fields to select from scooter
      })
      .select('startTime endTime') // Select start and end time fields from Rental model
      .exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return rentals along with pagination metadata
    res.json({
    rentedScooters,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteRentedScooter (req, res) {
    try {
      const { userId, scooterId } = req.params;
  
      // Find the user by userId
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Check if the scooterId exists in the user's rentedScooters array
      const rentedScooterIndex = user.rentals.findIndex(scooter => {
        console.log(scooter);
        scooter.equals(new ObjectId(scooterId))});
  
      if (rentedScooterIndex === -1) {
        return res.status(404).json({ error: 'Rented scooter not found for this user' });
      }
  
      // Remove the rented scooter from the user's rentedScooters array
      user.rentals.splice(rentedScooterIndex, 1);
  
      // Save the updated user object
      await user.save();
  
      res.json({ message: 'Rented scooter removed successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Server error' });
    }
  };
module.exports = { getUserRentals, deleteRentedScooter };
