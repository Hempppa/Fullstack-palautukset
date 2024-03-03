import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, likeBlog, username, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = (event) => {
    event.preventDefault()
    likeBlog(blog)
  }

  const remove = (event) => {
    event.preventDefault()
    removeBlog(blog)
  }

  return (
    <div style={blogStyle} className='blog'>
      <div style={hideWhenVisible} className="showAlways">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} className='viewButton'>view</button>
      </div>
      <div style={showWhenVisible} className="showAll">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility} className='hideButton'>hide</button><br></br>
        {blog.url}<br></br>
        likes {blog.likes}<button onClick={addLike} className='likeButton'>like</button><br></br>
        {blog.user.username}<br></br>
        {username === blog.user.username && <button onClick={remove} className='removeButton'>remove</button>}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog