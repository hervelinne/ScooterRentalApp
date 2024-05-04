const mongoose = require('mongoose'); 


// should use mater process.env.DATABASE_URI instead of actual path of db 
async function connect(){
    try{
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true, 
            useNewUrlParser: true
        }); 
    }catch(error){
        console.log(error)
    }
}

module.exports = connect 