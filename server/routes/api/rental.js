// routes/rental.js
const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rentalController');

// Create a rental
router.post('/rent', rentalController.createRental);

// End a rental
router.post('/end/:id', rentalController.endRental);

// Get all rentals for a user
router.get('/user/:userId', rentalController.getRentals);

//delete a rental 
router.delete('/:rentalId', rentalController.deleteRental); 

// Route to get rentals for a specific scooter
router.get('/scooter/rentals/:scooterId', rentalController.getRentalsByScooter);

module.exports = router;