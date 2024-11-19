const express = require('express');
const { saveUser } = require('../controllers/userController');
const userRouter = express.Router();
userRouter.post('/register',saveUser);

module.exports = userRouter