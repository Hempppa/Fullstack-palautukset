const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0? + 0 : blogs.reduce(reducer, 0) 
}

const favoriteBlog = (blogs) => {
    var theBlog = {title:"", author:"", likes:0}
    blogs.forEach(blog => {
        if (blog.likes > theBlog.likes) {
            theBlog.title = blog.title
            theBlog.author = blog.author
            theBlog.likes = blog.likes
        }
    })
    return theBlog
}

const mostBlogs = (blogs) => {
    var theBlogger = {author:"", blogs:0}
    const blogsTally = blogs.reduce((accumulator, blog) => {
        if (!accumulator[blog.author]) {
            accumulator[blog.author] = 0
        }
        accumulator[blog.author] += 1
        if (accumulator[blog.author] > theBlogger.blogs) {
            theBlogger.author = blog.author
            theBlogger.blogs = accumulator[blog.author]
        }
        return accumulator
    }, {})
    return theBlogger
}

const mostLikes = (blogs) => {
    var theBlogger = {author:"", likes:0}
    const likesTally = blogs.reduce((accumulator, blog) => {
        if (!accumulator[blog.author]) {
            accumulator[blog.author] = 0
        }
        accumulator[blog.author] += blog.likes
        if (accumulator[blog.author] > theBlogger.likes) {
            theBlogger.author = blog.author
            theBlogger.likes = accumulator[blog.author]
        }
        return accumulator
    }, {})
    return theBlogger
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}