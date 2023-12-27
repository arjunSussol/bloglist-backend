const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(helper.initialBlogs);
});

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

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async() => {
		const blogsAtStart = await helper.blogsInDB();
		const blogToBeDeleted = blogsAtStart[0];

		await api
			.delete(`/api/blogs/${blogToBeDeleted.id}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);

		const blogsTitle = blogsAtEnd.map(blog => blog.title);
		expect(blogsTitle).not.toContain(blogToBeDeleted.title);
	});
});

describe('update a blog', () => {
	const blog = {
		title: 'Go To',
		author: 'Edsger',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 555,
	};
	test('updateing a blog with id', async() => {
		const blogsAtStart = await helper.blogsInDB();
		const blogToUpdate = blogsAtStart[0];

		const updatedBlog = await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(blog)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
		const blogIDs = blogsAtEnd.map(({ id }) => id);
		expect(blogIDs).toContain(updatedBlog.body.id);

	});

	test('fails with status code 400 if data invalid', async() => {
		const blogsAtStart = await helper.blogsInDB();
		const blogToUpdate = blogsAtStart[0];
		await api
			.put(`/api/blogs/${blogToUpdate}`)
			.send(blog)
			.expect(400);
	});
});

describe('when there is initially one user in db', () => {
	beforeEach(async() => {
		await User.deleteMany({});

		const passwordHash = await bcrypt.hash('sekret', 10);
		const user = new User({
			username: 'root',
			passwordHash
		});

		await user.save();
	});

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDB();
		const newUser = {
			username: 'arjun',
			name: 'Arjun Sah',
			password: 'arjun'
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtEnd).toHaveLength(usersAtStart.length+1);

		const usernames = usersAtEnd.map(u => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username already exist', async () => {
		const usersAtStart = await helper.usersInDB();
		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'superuser'
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain(`${newUser.username} must be unique.`);

		const usersAtEnd = await helper.usersInDB();
		expect(usersAtStart).toEqual(usersAtEnd);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});