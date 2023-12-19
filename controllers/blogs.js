const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({});
	response.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
	const blog = new Blog(req.body);
	try {
		const savedBlog = await blog.save();
		res.json(savedBlog);
	} catch (error) {
		next(error);
	}
});

module.exports = blogsRouter;