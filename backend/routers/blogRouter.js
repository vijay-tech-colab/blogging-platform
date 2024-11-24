const express = require('express');
const blogRouter = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { postBlog, getBlogById, updateBlog, deleteBlog, getAllBlog } = require('../controllers/blogController');
blogRouter.post("/save-blog",authMiddleware,postBlog);
blogRouter.get('/get/:id',getBlogById);
blogRouter.put('/update-blog/:id',authMiddleware,updateBlog);
blogRouter.delete('/delete-blog/:id',authMiddleware,deleteBlog);
blogRouter.get('/all-blog',authMiddleware,getAllBlog);
module.exports = blogRouter