const express = require('express');
const { saveUser, loginUser, updateUser, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const userRouter = express.Router();
userRouter.post('/register',saveUser);
userRouter.post('/login',loginUser);
userRouter.put('/update',authMiddleware,updateUser);
userRouter.post('/change-password',authMiddleware,changePassword)
module.exports = userRouter