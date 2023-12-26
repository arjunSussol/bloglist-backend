const bcrypt = require('bcryptjs');
const userRouter = require('express').Router();

const User = require('../models/user');

userRouter.get('/', async(req, res) => {
	const users = await User.find({});
	res.json(users);
});

userRouter.post('/', async(req, res, next) => {
	const { username, name, password } = req.body;
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