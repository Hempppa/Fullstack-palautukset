import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('creates new blog with appropriate information', async () => {
    const user = userEvent.setup()
    const mockCreateBlog = jest.fn()
    render(<NewBlogForm createNewBlog={mockCreateBlog}/>)
    
    const titleInput = screen.getByPlaceholderText('Blog title here')
    const authorInput = screen.getByPlaceholderText('Blog author here')
    const urlInput = screen.getByPlaceholderText('Blog url here')
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'test title')
    await user.type(authorInput, 'test author')
    await user.type(urlInput, 'test url')
    await user.click(sendButton)

    expect(mockCreateBlog.mock.calls[0][0].title).toBe('test title')
    expect(mockCreateBlog.mock.calls[0][0].author).toBe('test author')
    expect(mockCreateBlog.mock.calls[0][0].url).toBe('test url')
})
