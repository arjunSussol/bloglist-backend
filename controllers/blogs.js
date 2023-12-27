const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');
const User = require('../models/user');

const getTokenFrom = request => {
	const authorization = request.get('authorization');
	if (authorization && authorization.startsWith('Bearer ')) {
		return authorization.replace('Bearer ', '');
	}

	return null;
};

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	response.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
	const { title, url, likes, author } = req.body;
	const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
	if (!decodedToken.id) {
		return res.status(401).json({ error: 'invalid token' });
	}

	const user = await User.findById(decodedToken.id);

	const blog = new Blog({
		title,
		url,
		likes,
		author,
		user: user.id
	});

	try {
		const savedBlog = await blog.save();
		user.blogs = user.blogs.concat(savedBlog._id);
		await user.save();
		res.status(200).json(savedBlog);

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