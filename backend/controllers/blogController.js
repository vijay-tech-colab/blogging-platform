const catchAsyncError = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../middleware/errorClass");
const Blog = require("../models/blogSchema");
const cloudinary = require('cloudinary').v2;
const User = require('../models/userSchema');

exports.postBlog = catchAsyncError(async (req, res, next) => {
    const user = req.user;
    const { title, content, tags } = req.body;

    if (!title || !content) {
        return next(new ErrorHandler("Fill the all field ?"))
    }
    if (user.role !== "admin") {
        return next(new ErrorHandler("blog create only admin role", 400));
    }
    const { image } = req.files;
    console.log(image)
    if (!req.files || !Object.keys(req.files).length) {
        return next(new ErrorHandler("Image required !", 400));
    }
    const cloudinaryResForImage = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Blog"
    });
    if (!cloudinaryResForImage) {
        return next(new ErrorHandler("Failed to upload image to Cloudinary.", 500));
    }
    // Create the blog entry in the database
    const blog = await Blog.create({
        title,
        content,
        tags,
        author: user._id,
        image: {
            publicId: cloudinaryResForImage.public_id,
            url: cloudinaryResForImage.secure_url,
        },
    });

    // Respond with the created blog data
    res.status(201).json({
        success: true,
        message: "Blog created successfully!",
        blog,
    });
});

exports.getAllBlog = catchAsyncError(async (req, res, next) => {
    const { limit = 10, page = 1 } = req.query;

    // Convert query parameters to numbers
    const limitNum = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * limitNum;

    // Fetch blogs with pagination
    const blogs = await Blog.find()
        .limit(limitNum)
        .skip(skip);

    // Get total count for pagination metadata
    const totalBlogs = await Blog.countDocuments();

    res.status(200).json({
        success: true,
        totalBlogs,
        totalPages: Math.ceil(totalBlogs / limitNum),
        currentPage: parseInt(page, 10),
        blogs,
    });
});


exports.getBlogById = catchAsyncError(async (req, res, next) => {
    const id = req.params.id;
    console.log(id)
    // Check if ID is provided
    if (!id) {
        return next(new ErrorHandler('Invalid Blog ID', 400));
    }

    // Find blog by ID in the database
    const blog = await Blog.findById(id);
    console.log(blog)
    // Handle case when blog is not found
    if (!blog) {
        return next(new ErrorHandler('Blog not found', 404));
    }

    // If blog is found, return it
    res.status(200).json({
        success: true,
        blog,
    });
});


exports.updateBlog = catchAsyncError(async (req, res, next) => {
    const blogId = req.params.id;
    const userId = req.user.id; // Assuming `req.user` contains authenticated user info
    console.log(blogId, userId);
    // Validate the blog ID
    if (!blogId) {
        return next(new ErrorHandler('Invalid Blog ID', 400));
    }

    // Check if the user is an admin
    const user = await User.findById(userId);
    console.log(user)
    if (!user || user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admins only.', 403));
    }

    // Find the blog in the database
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return next(new ErrorHandler('Blog not found', 404));
    }

    // Update fields (only those provided in the request body)
    const { title, content, tags } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (tags) blog.tags = tags.split(',').map((tag) => tag.trim());

    // Handle image update
    if (req.file) {
        // Delete the existing image from Cloudinary if it exists
        if (blog.image && blog.image.publicId) {
            await cloudinary.uploader.destroy(blog.image.publicId);
        }

        // Upload the new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'blog_images', // Customize folder name as needed
        });

        // Update the blog's image details
        blog.image = {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }

    // Save the updated blog
    const updatedBlog = await blog.save();

    res.status(200).json({
        success: true,
        message: 'Blog updated successfully!',
        blog: updatedBlog,
    });
});

exports.deleteBlog = catchAsyncError(async (req, res, next) => {
    const user = req.user; // User info from authentication middleware
    const blogId = req.params.id;

    // Check if the user is an admin
    if (!user || user.role !== 'admin') {
        return next(new ErrorHandler('Access denied. Admins only.', 403));
    }

    // Validate the blog ID
    if (!blogId) {
        return next(new ErrorHandler('Invalid Blog ID', 400));
    }

    // Find the blog by ID
    const blog = await Blog.findByIdAndDelete(blogId);

    res.status(200).json({
        success: true,
        message: 'Blog deleted successfully!',
    });
});