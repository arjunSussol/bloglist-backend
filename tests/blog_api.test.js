const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');

const app = require('../app');

const api = supertest(app);

test('Blogs are returned as JSON', async () => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);
	console.log('response ', response.body);
});

test('the property id exist to database', async () => {
	const blogsAtStart = await helper.blogsInDB();
	expect(blogsAtStart[0].id).toBeDefined();
});

test('Add a blog to server', async () => {
	const blogsAtStart = await helper.blogsInDB();
	const newBlog = {
		title: 'Full-stack development',
		author: 'Arjun',
		url: 'https://fullstackopen.com/en/#course-contents'
	};

	await api
		.post('/api/blogs')
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	const blogsAtEnd = await helper.blogsInDB();
	expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
	const blogs = blogsAtEnd.map(blog => blog.author);
	expect(blogs).toContain(newBlog.author);
});

afterAll(async () => {
	await mongoose.connection.close();
});