const app = require('./app');
const cloudinary = require('cloudinary').v2;
const dbConnection = require('./DB/dbConnection');
// setup cloudinary 

cloudinary.config({
    api_key : process.env.CLOUDINARY_API_KEY,
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const PORT = process.env.PORT || 3000
dbConnection();
app.listen(PORT, () => {
    console.log('server running on ' + PORT);
})