const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response, next) => {
	try {
		const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
		response.json(blogs);
	} catch (error) {
		next(error);
	}
});

// use the middleware only in specific routes
blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
	const { title, url, likes, author } = req.body;
	try {
		const user = req.user;
		if (!user) {
			return res.status(401).json({ error: 'operation not permitted' });
		}

		const blog = new Blog({
			title,
			url,
			likes,
			author,
			user: user.id
		});

		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		res.status(200).json(savedBlog);

	} catch (error) {
		next(error);
	}
});

// use the middleware only in specific routes
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
	try{
		const user = req.user;
		const blog = await Blog.findById(req.params.id);

		if (!user || blog.user.toString() !== user.id.toString()) {
			return res.status(401).json({ error: 'operation not permitted' });
		}

		if (blog.user.toString() === user.id.toString()) {
			await Blog.deleteOne({ _id: blog.id });

			const indexOfBlogId = user.blogs.indexOf(blog.id);
			user.blogs.splice(indexOfBlogId, 1);
			await user.save();
			res.status(204).end();
		}

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