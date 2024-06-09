const Scooter = require('../models/Scooter');
const mongoose = require('mongoose'); 

// Add a new scooter
async function addScooter(req, res) {
    const { brand, color, price, city, address, latitude, longitude, isAvailable } = req.body;

    // Create the location object
    const location = {
        coordinates: [longitude, latitude],
        type: 'Point'
    };

    try {
        // Create a new scooter document
        await Scooter.create({ brand, color, address, city, location, price, isAvailable });
        return res.sendStatus(201); // Send a success response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}

// Get a scooter by ID
async function getScooter(req, res) {
    const scooterId = req.params.scooterId;

    try {
        // Find the scooter by ID
        const scooter = await Scooter.findById(scooterId).exec();
        
        if (!scooter) {
            return res.status(404).json({ message: "Scooter not found" });
        }

        return res.status(200).json(scooter); // Send the scooter data as a JSON response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}

// Update a scooter by ID
async function updateScooter(req, res) {
    const scooterId = req.params.scooterId;
    const updateData = req.body;

    try {
        // Find the scooter by ID and update it
        await Scooter.findByIdAndUpdate(scooterId, updateData).exec();
        return res.sendStatus(200); // Send a success response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}

// Update scooter image by ID
async function updateScooterImage(req, res) {
    const scooterId = req.params.scooterId;
    const { imageName } = req.body;

    try {
        // Find the scooter by ID and update the image name
        await Scooter.findByIdAndUpdate(scooterId, { imageName }).exec();
        return res.sendStatus(200); // Send a success response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}

// Get all scooters
async function getScooters(req, res) {
    try {
        // Retrieve all scooters from the database
        const scooters = await Scooter.find().exec();
        return res.status(200).json(scooters); // Send the scooter data as a JSON response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}

// Delete scooter by id 
async function deletScooter(req, res){
    const scooterId = req.params.scooterId;

    try {
        // Find the scooter by ID and update it
        await Scooter.findByIdAndDelete(scooterId).exec();
        return res.sendStatus(200); // Send a success response
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" }); // Send an error response
    }
}


// getScooters using pagination
async function getScootersWithPagination(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3; // Default limit to 3 if not specified

    // Calculate the start and end indexes for the requested page
    const startIndex = (page - 1) * limit;
    //const endIndex = page * limit;

    // Define filter object
    const filter = {};

    // Apply color filter if provided
    if (req.query.color) {
        filter.color = req.query.color;
    }

    // Apply city filter if provided
    if (req.query.city) {
        filter.city = req.query.city;
    }

    // Apply brand filter if provided
    if (req.query.brand) {
        filter.brand = req.query.brand;
    }

    // Apply price filter if provided
    if (req.query.minPrice && req.query.maxPrice) {
        filter.price = { $gte: parseInt(req.query.minPrice), $lte: parseInt(req.query.maxPrice) };
    } else if (req.query.minPrice) {
        filter.price = { $gte: parseInt(req.query.minPrice) };
    } else if (req.query.maxPrice) {
        filter.price = { $lte: parseInt(req.query.maxPrice) };
    }

   try {
        // Retrieve paginated scooters from the database based on filters
        const scooters = await Scooter.find(filter).skip(startIndex).limit(limit).exec();
        const count = await Scooter.countDocuments(filter).exec(); // Count total number of scooters

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / limit);

        // Send the paginated scooters and total pages as the API response
        res.json({ scooters, totalPages });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// Get filter options for colors, cities, and brands
async function getFilterOptions(req, res) {
    try {
        // Get unique colors from the database
        const colors = await Scooter.distinct('color').exec();

        // Get unique cities from the database
        const cities = await Scooter.distinct('city').exec();

        // Get unique brands from the database
        const brands = await Scooter.distinct('brand').exec();

        // Get min and max prices from the database
        const minPrice = await Scooter.find().sort({ price: 1 }).limit(1).select('price').exec();
        const maxPrice = await Scooter.find().sort({ price: -1 }).limit(1).select('price').exec();

        res.status(200).json({ colors, cities, brands, minPrice: minPrice[0].price, maxPrice: maxPrice[0].price });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getScootersNearMe(req, res) {
    // Pagination parameters
    longitude = req.query.longitude
    latitude = req.query.latitude
     page = parseInt(req.query.page) || 1;
     limit = parseInt(req.query.limit) || 3; 

     const startIndex = (page - 1) * limit;
    try {

        // Query scooters near the specified location
        const scooters = await Scooter.find({
            "location.coordinates": {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: 20000 //20km distance
                }
            }
        })
        .skip(startIndex).limit(limit)
        .exec();

        res.json({ scooters });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}



module.exports = { addScooter, getScooter, updateScooter, updateScooterImage, getScooters, getScootersNearMe
                 ,deletScooter, getScootersWithPagination, getFilterOptions };
