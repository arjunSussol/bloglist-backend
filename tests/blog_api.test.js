const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');

const app = require('../app');

const api = supertest(app);

describe('initially test to get/post a blog', () => {

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
			url: 'https://fullstackopen.com/en/#course-contents',
			likes: 99
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
});

describe('Missing a property from request', () => {
	test('likes is missing, set default to zero', async () => {
		const newBlog = {
			title: 'test if likes is missing, then set to zero',
			author: 'likes',
			url: 'https://fullstackopen.com/en/#course-contents'
		};

		const savedBlog = await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/);
		expect(savedBlog.body).toMatchObject({ 'likes': 0 });
	});

	test('fails with status code 400 if data invalid by missing title or url', async () => {
		const blogsAtStart = await helper.blogsInDB();

		const newBlog = {
			title: 'test if likes is missing, then set to zero',
			author: 'likes',
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});