import { useState } from 'react'
import PropTypes from 'prop-types'

const NewBlogForm = ({createNewBlog}) => {
    const [newBlog, setNewBlog] = useState({title: "", author: "", url: ""})

    const addBlog = (event) => {
        event.preventDefault()
        createNewBlog(newBlog)
    }

    return (
        <form onSubmit={addBlog}>
            <div>
                title
                <input 
                    type="text" 
                    value={ newBlog.title } 
                    name="title"
                    id="titleInput" 
                    placeholder='Blog title here'
                    onChange={({ target }) => setNewBlog({...newBlog, title: target.value})}
                />
            </div>
            <div>
                author
                <input 
                    type="text" 
                    value={ newBlog.author } 
                    name="author" 
                    id="authorInput"
                    placeholder='Blog author here'
                    onChange={({ target }) => setNewBlog({...newBlog, author: target.value})}
                />
            </div>
            <div>
                url
                <input 
                    type="text" 
                    value={ newBlog.url } 
                    name="url" 
                    id="urlInput"
                    placeholder='Blog url here'
                    onChange={({ target }) => setNewBlog({...newBlog, url: target.value})}
                />
            </div>
            <button type="submit" id="createBlog">create</button>
        </form>
    )
}

NewBlogForm.propTypes = {
    createNewBlog: PropTypes.func.isRequired
}

export default NewBlogForm