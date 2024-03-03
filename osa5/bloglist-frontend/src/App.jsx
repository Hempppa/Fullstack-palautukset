import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorMessage from './components/ErrorMessage'
import NewBlogForm from './components/NewBlogForm'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState({token: "", username: "", name: ""})
  const [loginInfo, setLoginInfo] = useState({username: "", password: ""})
  const [errorMessage, setErrorMessage] = useState("")
  const [notification, setNotification] = useState("")

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs( blogs.sort((a,b) => {return b.likes-a.likes}) )
      console.log("got blogs")
    })  
  }, [notification, errorMessage])

  const createNewBlog = (newBlog) => {
    blogService.create(newBlog)
      .then(result => {
        blogFormRef.current.toggleVisibility()
        setNotification(`a new blog ${result.title} by ${result.author} added`)
        setTimeout(() => {setNotification("")}, 5000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {setErrorMessage("")}, 5000)
      })
  }

  const login = async (event) => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({
        username: loginInfo.username,
        password: loginInfo.password
      })
      console.log(loggedUser)
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(loggedUser))
      setLoginInfo({username:"", password:""})
      setNotification("login successful")
      setTimeout(() => {setNotification("")}, 5000)
    } catch {
      setErrorMessage("wrong username or password")
      setTimeout(() => {setErrorMessage("")}, 5000)
    }
  }

  const likeBlog = (blog) => {
    blogService.addLike(blog)
      .then(result => {
        console.log(result)
        setNotification("blog liked")
        setTimeout(() => {setNotification("")}, 2000)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {setErrorMessage("")}, 5000)
      })
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService.removeABlog(blog)
        .then(result => {
          setNotification(`a blog ${result.title} by ${result.author} was removed`)
          setTimeout(() => {setNotification("")}, 5000)
        })
        .catch(error => {
          setErrorMessage("not owner of blog; ", error)
          setTimeout(() => {setErrorMessage("")}, 5000)
        })
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser({token: "", username: "", name: ""})
  }

  if (user.token) {
    return (
      <div>
        <h2>blogs</h2>
        <Notification message={notification}/>
        <ErrorMessage message={errorMessage}/>
        {user.username} logged in <button onClick={logout}>Logout</button>
        <Toggleable buttonLabel='new Blog' ref={blogFormRef}>
          <NewBlogForm createNewBlog={createNewBlog}/>
        </Toggleable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} username={user.username} removeBlog={removeBlog}/>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <ErrorMessage message={errorMessage}/>
      <form onSubmit={login}>
        <div>
          username
          <input 
            type="text" 
            value={ loginInfo.username } 
            name="Username"
            id="Username"
            onChange={({ target }) => setLoginInfo({...loginInfo, username: target.value})}
          />
        </div>
        <div>
          password
          <input 
            type="password" 
            value={ loginInfo.password } 
            name="Password" 
            id="Password"
            onChange={({ target }) => setLoginInfo({...loginInfo, password: target.value})}
          />
        </div>
        <button type="submit" id="loginButton">login</button>
      </form>
    </div>
  )
}

export default App