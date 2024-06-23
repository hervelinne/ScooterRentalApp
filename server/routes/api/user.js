const express = require('express');
const router = express.Router();
const { getUserRentals, deleteRentedScooter } = require('../../controllers/userController');

// GET /api/users/rented-scooters/:userId?page=1&limit=10
router.get('/rented-scooters/:userId', getUserRentals);
router.delete('/rented-scooters/:userId/:scooterId', deleteRentedScooter);
module.exports = router;
