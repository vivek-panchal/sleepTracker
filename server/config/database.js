const mongoose = require('mongoose');
require('dotenv').config();

const databaseConnection = () => { 
    mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: 'majority' } 
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(error => 
        console.log("Error connecting db",error)
    );
}

module.exports = databaseConnection;