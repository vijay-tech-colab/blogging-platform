const mongoose = require('mongoose');

const dbConnection = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected successfully ?'))
    .catch(err => console.log("DB ERROR ",err));
}

module.exports = dbConnection;