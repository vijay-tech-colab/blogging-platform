const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../middleware/errorClass");
const User = require("../models/userSchema");
const cloudinary = require('cloudinary').v2;
exports.saveUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, role } = req.body;
  
    // Validate required fields
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please fill all the fields!", 400));
    }
  
    // Check if the user being created has the "admin" role
    if (role === "admin") {
      const existingAdmin = await User.findOne({ role: "admin" });
      if (existingAdmin) {
        return next(new ErrorHandler("Admin already exists!", 400));
      }
    }
  
    // Example cloudinary file upload (if needed)
    // const { image } = req.files;
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return next(new ErrorHandler("Image required", 400));
    // }
    // const cloudinaryResponseForImage = await cloudinary.uploader.upload(image, {
    //   folder: "BLOG_IMG",
    // });
    // if (!cloudinaryResponseForImage) {
    //   return next(new ErrorHandler("Image upload failed", 500));
    // }
  
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role, // Use the role provided in the request
    });
  
    // Generate token
    const token = user.generateToken();
  
    // Set cookie and respond
    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true, // Prevent client-side access
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 1 day
      })
      .json({
        success: true,
        token,
        message: "User saved successfully",
      });
  });