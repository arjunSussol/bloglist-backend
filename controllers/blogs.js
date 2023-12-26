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

blogsRouter.delete('/:id', async (req, res, next) => {
	try{
		await Blog.findByIdAndDelete(req.params.id);
		res.status(204).end();
	} catch(error) {
		next(error);
	}
});

blogsRouter.put('/:id', async (req, res, next) => {
	try {
		const { title, author, url, likes } = req.body;
		const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, { title, author, url, likes }, { new: true });
		res.status(200).json(updatedBlog);
	} catch (error) {
		next(error);
	}
});

module.exports = blogsRouter;