const bcrypt = require('bcryptjs');
const userRouter = require('express').Router();

const User = require('../models/user');

userRouter.get('/', async(req, res) => {
	const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
	res.json(users);
});

userRouter.post('/', async(req, res, next) => {
	const { username, name, password } = req.body;
	if (!password || password.length < 3) {
		return res.status(201).json({ error: 'Password is required and must be at least 3 characters long.' });
	}

	const salt = 10;
	const passwordHash = await bcrypt.hash(password, salt);
	const user = new User({
		username,
		name,
		passwordHash
	});

	try {
		const newUser = await user.save();
		res.status(200).json(newUser);
	} catch (error) {
		next(error);
	}
});

module.exports = userRouter;