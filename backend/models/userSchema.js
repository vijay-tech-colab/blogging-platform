const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define roles for authorization
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if(!user.isModified("password")){
      return next();
    }
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password,genSalt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
});
userSchema.comparePassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword,this.password);
  } catch (error) {
    
  }
}

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this.id }, // Include user-specific payload
    process.env.JWT_SECRET_KEY, // Secret key
    { expiresIn: process.env.JWT_EXPIRES } // Token expiration time
  );
};
const User = mongoose.model('User', userSchema);

module.exports = User;
