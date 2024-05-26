const Scooter = require('../models/Scooter');

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
    const endIndex = page * limit;

    try {
        // Retrieve paginated scooters from the database
        const scooters = await Scooter.find().skip(startIndex).limit(limit).exec();
        const count = await Scooter.countDocuments().exec(); // Count total number of scooters

        // Calculate the total number of pages
        const totalPages = Math.ceil(count / limit);
    
        // Send the paginated scooters and total pages as the API response
        res.json({ scooters, totalPages });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


// Controller function to fetch scooters with pagination & near the user 
async function getScootersWithPaginationNearby(req, res) {
    try {
      // Parse page and limit parameters from the request query string
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      // Parse latitude and longitude parameters from the request query string
      const latitude = parseFloat(req.query.latitude) || 0;
      const longitude = parseFloat(req.query.longitude) || 0;
  
      // Define radius for nearby scooters (in kilometers)
      const radius = 5; // Example radius
  
      // Calculate the maximum and minimum latitude and longitude based on the user's location and radius
      const maxLat = latitude + (radius / 110.574); // 1 degree of latitude is approximately 110.574 kilometers
      const minLat = latitude - (radius / 110.574);
      const maxLng = longitude + (radius / (111.32 * Math.cos(latitude * (Math.PI / 180)))); // 1 degree of longitude varies depending on latitude
      const minLng = longitude - (radius / (111.32 * Math.cos(latitude * (Math.PI / 180))));
  
      // Query the database for scooters within the specified radius
      const scooters = await Scooter.find({
        $and: [
          { latitude: { $gte: minLat, $lte: maxLat } }, // Latitude within range
          { longitude: { $gte: minLng, $lte: maxLng } } // Longitude within range
        ]
      })
        .skip(skip)
        .limit(limit);
  
      // Count total number of scooters
      const count = await Scooter.countDocuments({
        $and: [
          { latitude: { $gte: minLat, $lte: maxLat } }, // Latitude within range
          { longitude: { $gte: minLng, $lte: maxLng } } // Longitude within range
        ]
      });
  
      // Calculate total number of pages
      const totalPages = Math.ceil(count / limit);
  
      // Send response with paginated scooters and total pages
      res.status(200).json({ scooters, totalPages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }



module.exports = { addScooter, getScooter, updateScooter, updateScooterImage, getScooters
                 ,deletScooter, getScootersWithPagination, getScootersWithPaginationNearby };
