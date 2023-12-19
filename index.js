require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const Blog = require('./models/blog');

const { PORT } = process.env;
morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(express.json());
app.use(morgan(':body :method :status :res[content-length] - :response-time ms'));
app.use(cors());

app.get('/api/blogs', (req, res) => {
	Blog
		.find({})
		.then(list => res.json(list));

});

app.post('/api/blogs', (req, res) => {
	const blog = new Blog(req.body);
	blog
		.save()
		.then(savedBlog => res.json(savedBlog));

});

app.listen(PORT, () => {
	console.log(`server is running on port ${PORT}`);
});