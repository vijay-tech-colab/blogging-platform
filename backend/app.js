const cookieParser = require('cookie-parser');
const express = require('express');
const fileUpload = require('express-fileupload');
const errorMiddleware = require('./middleware/errorMiddleWare');
const userRouter = require('./routers/userRouter');
const app = express();
require('dotenv').config({path : './config/config.env'});
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true, // Enable temporary file usage
    tempFileDir: './tmp', // Temporary directory for storing files
}));
app.use("/auth/user",userRouter);
app.use(errorMiddleware); // global error handler
module.exports = app;