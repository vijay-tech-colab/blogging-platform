const jwt = require('jsonwebtoken');
const ErrorHandler = require('./errorClass');
const catchAsyncError = require('./catchAsyncErrors');
const User = require('../models/userSchema');

const authMiddleware = catchAsyncError(async (req,res,next) =>{
    const {token }= req.cookies;
    console.log(token);
    if(!token){
        return next(new ErrorHandler("User not Athentication",400));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);
    next();
})

module.exports = authMiddleware;