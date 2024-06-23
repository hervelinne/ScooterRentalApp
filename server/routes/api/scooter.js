const express = require('express');
const router = express.Router();
const scooterController = require('../../controllers/scooterController');

// Add scooter
router.post('/add_scooter', scooterController.addScooter);

// Get scooter by ID
router.get('/get_scooter/:scooterId', scooterController.getScooter);

// Update scooter by ID
router.put('/update_scooter/:scooterId', scooterController.updateScooter);

// Update scooter image by ID
router.put('/update_scooter_image/:scooterId', scooterController.updateScooterImage);

// Get all scooters
router.get('/get_scooters', scooterController.getScooters);

// Delete scoooter by ID 
router.delete('/delete_scooter/:scooterId', scooterController.deletScooter);

// Get Scooters with pagination 
router.get('/get_scooters_pagination', scooterController.getScootersWithPagination);

 // Fetching scooters with pagination and filtering by user location
router.get('/nearby', scooterController.getScootersNearMe);

// Fetching scooters with pagination and filtering by user location
router.get('/filter_options', scooterController.getFilterOptions);

// Getting scooter's rental 
router.get('/rentals/:scooterId', scooterController.getScootersRental);
module.exports = router;
