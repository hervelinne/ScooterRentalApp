require('dotenv').config() //loads the .env docs 

const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const path = require('path')
const corsOption = require('./config/cors')
const connectDB = require('./config/database')
const credentials = require('./middleware/credentials')
const errorHandlerMiddleware = require('./middleware/error_handler')

const app = express()
const PORT = 3500

connectDB()

mongoose.connection.once('open', () => {
    mongoose.connection.db.collection('scooters').createIndex({ "location.coordinates": "2dsphere" }, (err) => {
        if (err) {
            console.error('Error creating index:', err);
        } else {
            console.log('2dsphere index created successfully.');
        }
    });
});

// Allow credentials 
app.use(credentials)

// CORS
app.use(cors(corsOption))

// application.x-www-form-urlencoded 
app.use(express.urlencoded({ extended : true }))

// application/json response 
app.use(express.json())

// Middleware for cookies 
app.use(cookieParser())

// Static file 
app.use('/static', express.static(path.join(__dirname,'public')))

// Default error Handler 
app.use(errorHandlerMiddleware)

// Routes 
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/scooter', require('./routes/api/scooter')) 
app.use('/api/rental', require('./routes/api/rental'))
app.use('/api/user', require('./routes/api/user'))

//default routes inside of our app 
app.all('*', (req, res)=> {
    res.status(404)

    if(res.accepts('json')){
        res.json({'error': '404 not found '})
    }else {
        res.type('text').send( '404 not found ')
    }
})
mongoose.connection.once('open', ()=> {
    console.log('DB connected yey \\^w^/')
    app.listen(PORT, ()=> {
        console.log(`Listening on port ${PORT}`);
    })
})

// app.listen(PORT, ()=> {
//     console.log(`Listening on port ${PORT}`);
// })