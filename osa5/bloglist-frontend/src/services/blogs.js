import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const addLike = async (blog) => {
  const updatedBlog = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes+1,
    user: blog.user.id
  }
  const response = await axios.put(`${baseUrl}/${blog.id}`, updatedBlog)
  return response.data
}

const removeABlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}

export default { getAll, setToken, create, addLike, removeABlog }