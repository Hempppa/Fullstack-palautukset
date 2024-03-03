import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

let mockLikeBlog
let mockRemoveBlog
let blogForm
let container

beforeEach(() => {
    const blog = {
        id: "111111",
        title: "otsikko",
        author: "hemmpppaa",
        url: "www.wgaming.net",
        likes: 2,
        user: {
            id: "100000",
            username: "hempa",
            name: "hempa kokonimi"
        }
    }


    mockLikeBlog = jest.fn() 
    mockRemoveBlog = jest.fn()
    blogForm = <Blog blog={blog} likeBlog={mockLikeBlog} username='hempa' removeBlog={mockRemoveBlog} />
    
    container = render(blogForm).container
})


test('renders title and author', () => {
    const element = screen.getAllByText('hemmpppaa', {exact: false})
    expect(element[0]).toBeDefined()
    expect(element[1]).toBeDefined()

    const alwaysShown = container.querySelector('.showAlways')
    expect(alwaysShown).not.toHaveStyle('display: none')
})

test('no url or likes at first', () => {
    const allShown = container.querySelector('.showAll')
    expect(allShown).toHaveStyle('display: none')
})

test('button press makes url, likes and user visible', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')

    const allShown = container.querySelector('.showAll')
    expect(allShown).toHaveStyle('display: none')

    await user.click(viewButton)
    
    expect(allShown).not.toHaveStyle('display: none')
})

test('like button twice calls like function twice', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockLikeBlog.mock.calls).toHaveLength(2)
})