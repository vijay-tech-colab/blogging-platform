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
      const existingAdmin = await User.findOne({ role: "admin" })
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


// Login user function
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the fields!", 400));
  }

  // Find the user by email
  const user = await User.findOne({ email }).select("password");
  if (!user) {
    // If user not found, return an error
    return next(new ErrorHandler("User not found", 404));
  }

  // Compare the provided password with the stored hashed password
  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    // If the password doesn't match, return an error
    return next(new ErrorHandler("Invalid username or password", 401));
  }

  // Generate JWT token
  const token = user.generateToken();

  // Send response with token, set it as a cookie, and set the expiration time to 1 day
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true, // Prevent client-side access to the token
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 1 day
    })
    .json({
      success: true,
      token, // Return the token in the response body
      message: "Login successful", // Return success message
    });
});


// Update user function
exports.updateUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body; // Destructure fields from request body

  // Get the logged-in user from the request (assuming user is stored in req.user from authentication middleware)
  const specificUser = req.user;

  // Initialize an object to store fields to be updated
  const updateFields = {};

  // Check if the logged-in user is an admin to allow updating the role field
  if (role) {
    if (specificUser.role !== 'admin') {
      return next(new ErrorHandler("You do not have permission to update the role", 403)); // Forbidden if not admin
    }
    updateFields.role = role; // Only allow admins to update the role field
  }

  // Allow users to update name, email, and password if provided
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  // Find the user by ID and update it
  const updatedUser = await User.findByIdAndUpdate(specificUser._id, updateFields, {
    new: true, // Return the updated user document
    runValidators: true, // Ensure that validators are triggered during the update
  });

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Send response with updated user information
  res.status(200).json({
    success: true,
    user: updatedUser, // Return the updated user data (if needed)
    message: "User updated successfully",
  });

  console.log(specificUser); // Optionally log the original user (before update)
});


exports.changePassword = catchAsyncError(async (req,res,next) => {
  const {oldPassword,newPassword} = req.body;
  // Check if oldPassowrd and newPasswrod are provided
  if (!oldPassword || !newPassword) {
    return next(new ErrorHandler("Please fill all the fields!", 400));
  }
  const specificUser = req.user;
  const user = await User.findById(specificUser._id).select("password");
  if(!user){
    return next(new ErrorHandler("Invalid User", 404));
  }
  const isPasswordMatch = await user.comparePassword(oldPassword);
  if(!isPasswordMatch){
    return next(new ErrorHandler("Invalid Password", 400)); // Changed to 400 for invalid input
  }
  user.password = newPassword;
  await user.save();
  
  // Send response after successfully changing the password
  res.status(200).json({
    success: true,
    message: "Password changed successfully"
  });
})