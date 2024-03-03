const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const _ = require('lodash')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

let user1
let user2

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
	const saltRounds = 10
	const blogs = []
	const passHash1 = await bcrypt.hash(helper.initialUsers[0].password, saltRounds)
	const passHash2 = await bcrypt.hash(helper.initialUsers[1].password, saltRounds)

	let userObj = new User({
		username: helper.initialUsers[0].username,
		name: helper.initialUsers[0].name,
		passwordHash: passHash1, 
		blogs: blogs
	})
	user1 = await userObj.save()

	userObj = new User({
		username: helper.initialUsers[1].username,
		name: helper.initialUsers[1].name,
		passwordHash: passHash2, 
		blogs: blogs
	})
	user2 = await userObj.save()

	for (let blog of helper.initialBlogs.slice(0,4)) {
		let newBlog = new Blog({...blog, user:user1.id})
		await newBlog.save()
	}
	for (let blog of helper.initialBlogs.slice(4)) {
		let newBlog = new Blog({...blog, user:user2.id})
		await newBlog.save()
	}
})


describe('api testing', () => {
	describe('user routing', () => {
		describe('get users', () => {
			test('users are returned as json', async () => {
				await api
					.get('/api/users')
					.expect(200)
					.expect('Content-Type', /application\/json/)
			})
	
			test('there are two users', async () => {
				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 2)
			})
		})
		describe('user creation', () => {
			test('valid info', async () => {
				const newUser = {
					username: 'hemppppa',
					name: '',
					password: '1234'
				}

				await api
					.post('/api/users')
					.send(newUser)
					.expect(201)
					.expect('Content-Type', /application\/json/)

				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 3)
			})
			test('400 username missing', async () => {
				const newUser = {
					username: '',
					name: '',
					password: '1234'
				}

				await api
					.post('/api/users')
					.send(newUser)
					.expect(400)

				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 2)
			})
			test('400 too short username', async () => {
				const newUser = {
					username: 'he',
					name: '',
					password: '1234'
				}

				await api
					.post('/api/users')
					.send(newUser)
					.expect(400)

				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 2)
			})
			test('400 password missing', async () => {
				const newUser = {
					username: 'hemppppa',
					name: '',
					password: ''
				}

				await api
					.post('/api/users')
					.send(newUser)
					.expect(400)

				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 2)
			})
			test('400 too short password', async () => {
				const newUser = {
					username: 'hemppppa',
					name: '',
					password: '12'
				}

				await api
					.post('/api/users')
					.send(newUser)
					.expect(400)

				const response = await api.get('/api/users')
				assert.strictEqual(response.body.length, 2)
			})
		})
	})
	describe('login routing', () => {
		test('valid login', async () => {
			const user = {
				username: helper.initialUsers[0].username,
				password: helper.initialUsers[0].password
			}

			const token = await api
				.post('/api/login')
				.send(user)
				.expect(200)
			
			assert(token)
		})
		test('401 wrong username', async () => {
			const user = {
				username: 'hempa',
				password: helper.initialUsers[0].password
			}

			const token = await api
				.post('/api/login')
				.send(user)
				.expect(401)
		})
		test('401 wrong password', async () => {
			const user = {
				username: helper.initialUsers[0].username,
				password: '1233'
			}

			const token = await api
				.post('/api/login')
				.send(user)
				.expect(401)
		})
	})
	describe('blog routing', () => {
		describe('getting blogs', () => {
			test('blogs are returned as json', async () => {
			  await api
				.get('/api/blogs')
				.expect(200)
				.expect('Content-Type', /application\/json/)
			})
			test('there are six blogs', async () => {
				const response = await api.get('/api/blogs')
				assert.strictEqual(response.body.length, 6)
			})
			test('blogs have key named id', async () => {
				const response = await api.get('/api/blogs')
				assert(response.body[0].hasOwnProperty('id'))
			})
		})
		describe('adding blogs', async () => {
			const token1 = await api.post('/api/login').send({username: helper.initialUsers[0].username, password: helper.initialUsers[0].password})[0]
			const token2 = await api.post('/api/login').send({username: helper.initialUsers[1].username, password: helper.initialUsers[1].password})[0]
			const tokens = [token1, token2]
			test('a valid blog can be added ', async () => {
				const newBlog = {
					title: "otsikko",
					author: "hempppa",
					url: "www.gg.fi",
					likes: 1
				}
	
				await api
					.post('/api/blogs')
					.auth(tokens[0])
					.send(newBlog)
					.expect(201)
					.expect('Content-Type', /application\/json/)
	
				const response = await api.get('/api/blogs')
	
				var found = false
				response.body.forEach(blog => {
					if (blog.title === "otsikko" && blog.author === "hempppa" && blog.url === "www.gg.fi" && blog.likes === 1) {
						found = true
					}
				})
	
				assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
	
				assert(found)
			})
			test('blog without likes given is given zero likes', async () => {
				const newBlog = {
					title: "otsikko",
					author: "hempppa",
					url: "www.yeah.net"
				}
	
				await api
					.post('/api/blogs')
					.auth(tokens[0])
					.send(newBlog)
					.expect(201)
					.expect('content-Type', /application\/json/)
	
				const response = await api.get('/api/blogs')
	
				var found = false
				response.body.forEach(blog => {
					if (blog.title === "otsikko" && blog.author === "hempppa" && blog.url === "www.yeah.net" && blog.likes === 0) {
						found = true
					}
				})
	
				assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
	
				assert(found)
			})
			test('400 whne blog without title is added', async () => {
				const newBlog = {
					author: "hempppa",
					url: "www.yeah.net",
					likes: 1
				}
	
				await api
					.post('/api/blogs')
					.auth(tokens[0])
					.send(newBlog)
					.expect(400)
	
				const response = await api.get('/api/blogs')
	
				assert.strictEqual(response.body.length, helper.initialBlogs.length)
			})
			test('400 when blog without url is added', async () => {
				const newBlog = {
					title: "otsikko",
					author: "hempppa",
					likes: 1
				}
	
				await api
					.post('/api/blogs')
					.auth(tokens[0])
					.send(newBlog)
					.expect(400)
	
				const response = await api.get('/api/blogs')
	
				assert.strictEqual(response.body.length, helper.initialBlogs.length)
			})
			test('401 cant add blog without token', async () => {
				const newBlog = {
					title: "otsikko",
					author: "hempppa",
					url: "www.yeah.net",
					likes: 1
				}
	
				await api
					.post('/api/blogs')
					.send(newBlog)
					.expect(400)
	
				const response = await api.get('/api/blogs')
	
				assert.strictEqual(response.body.length, helper.initialBlogs.length)
			})
		})
		describe('editing blogs', () => {
			test('a specific blogs info can be edited', async () => {
				const initialBlogs = await helper.blogsInDb()
				const initialBlog = initialBlogs[0]
	
				const newBlog = {...initialBlog, likes:initialBlog.likes+1}
			  
				const resultBlog = await api
					.put(`/api/blogs/${initialBlog.id}`)
					.send(newBlog)
					.expect(200)
					.expect('Content-Type', /application\/json/)
	
				assert.strictEqual(resultBlog.body.likes, initialBlog.likes+1)
			})
		})
		describe('deleting blogs', async () => {
			const token1 = await api.post('/api/login').send({username: helper.initialUsers[0].username, password: helper.initialUsers[0].password})[0]
			const token2 = await api.post('/api/login').send({username: helper.initialUsers[1].username, password: helper.initialUsers[1].password})[0]
			const tokens = [token1, token2]
			test('a blog can be deleted', async () => {
				const initialBlogs = await helper.blogsInDb()
				const initialBlog = initialBlogs[0]
				
				await api
					.delete(`/api/blogs/${initialBlog.id}`)
					.auth(tokens[0])
					.expect(204)
	
				const response = await api.get('/api/blogs')
	
				var found = false
				response.body.forEach(blog => {
					if (blog.id === initialBlog.id) {
						found = true
					}
				})
			
				assert.strictEqual(response.body.length, helper.initialBlogs.length - 1)
			
				assert(!found)
			})
			test('401 cant delete without correct token', async () => {
				const initialBlogs = await helper.blogsInDb()
				const initialBlog = initialBlogs[0]
				
				await api
					.delete(`/api/blogs/${initialBlog.id}`)
					.auth(tokens[1])
					.expect(401)
	
				const response = await api.get('/api/blogs')
	
				var found = false
				response.body.forEach(blog => {
					if (blog.id === initialBlog.id) {
						found = true
					}
				})
			
				assert.strictEqual(response.body.length, helper.initialBlogs.length)
				assert(found)
			})
		})
	})
})

after(async () => {
  	await mongoose.connection.close()
})