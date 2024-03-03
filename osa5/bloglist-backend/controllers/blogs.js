const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1})
    response.json(blogs)
  })
  
blogsRouter.post('/', async (request, response) => {
    if (!request.user) { 
    	return response.status(401).json({error: 'token invalid'})
    }
	const user = request.user

    const blog = new Blog({...request.body, user: user.id})

    const result = await blog.save()
    user.blogs = user.blogs.concat(result.id)
    await user.save()

    response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
    if (!request.user) { 
    	return response.status(401).json({error: 'token invalid'})
    }

	const blog = await Blog.findById(request.params.id)
	if (blog.user.toString() === request.user.id.toString()) {
		await blog.deleteOne()
		response.status(204).end()
	} else {
		response.status(401).json({error: 'not blog creator'})
	}
})

blogsRouter.put('/:id', async (request, response) => {
    const blog = {...request.body}

    const updated = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updated)
})

module.exports = blogsRouter