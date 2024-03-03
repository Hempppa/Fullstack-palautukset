describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      username: "hempppa",
      name: "",
      password: "1234"
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
      cy.contains('Log in to application')
      cy.get('#Username')
      cy.get('#Password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#Username').type('hempppa')
      cy.get('#Password').type('1234')
      cy.get('#loginButton').click()

      cy.contains('hempppa logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#Username').type('hempppa')
      cy.get('#Password').type('1')
      cy.get('#loginButton').click()

      cy.contains('Log in to application')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: "hempppa", password: "1234" })
    })

    it('A blog can be created', function() {
      cy.contains('new Blog').click()
      cy.get('#titleInput').type('testaus blogi')
      cy.get('#authorInput').type('kirjoittaja')
      cy.get('#urlInput').type('osoite')
      cy.get('#createBlog').click()

      cy.contains('testaus blogi kirjoittaja')
    })

    describe('Blogs have been created', function() {
      beforeEach(function() {
        cy.createBlog({ title: "otsikko1", author: "kirjoittaja1", url: "osoite1" })
        cy.createBlog({ title: "otsikko2", author: "kirjoittaja2", url: "osoite2" })
        cy.createBlog({ title: "otsikko3", author: "kirjoittaja3", url: "osoite3" })
      })

      it('A blog can be liked', function() {
        cy.contains('otsikko1 kirjoittaja1').parent().as('theBlog')
        cy.get('@theBlog').contains('likes 0')
        cy.get('@theBlog').find('.viewButton').click()
        cy.get('@theBlog').find('.likeButton').click()
        cy.get('@theBlog').contains('likes 1')
      })

      it('A blog can be deleted', function() {
        cy.contains('otsikko1 kirjoittaja1').parent().find('.viewButton').click()
        cy.contains('otsikko1 kirjoittaja1').parent().find('.removeButton').click()
        cy.get('html').should('not.contain','otsikko1 kirjoittaja1')
      })

      it('Remove button isnt visible for other user', function() {
        window.localStorage.removeItem('loggedBlogappUser')
        const user2 = {
          username: "hempa",
          name: "",
          password: "1234"
        }
        cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
        cy.login({ username: "hempa", password: "1234" })
        cy.contains('otsikko1 kirjoittaja1').parent().should('not.contain', '.removeButton')
      })

      it('Blogs are ordered by likes in desc order', function() {
        cy.contains('otsikko1 kirjoittaja1').parent().contains('likes 0')
        cy.contains('otsikko1 kirjoittaja1').parent().find('.viewButton').click()
        cy.contains('otsikko1 kirjoittaja1').parent().find('.likeButton').click()
        cy.get('.blog').eq(0).should('contain', 'otsikko1 kirjoittaja1')

        cy.contains('otsikko2 kirjoittaja2').parent().contains('likes 0')
        cy.contains('otsikko2 kirjoittaja2').parent().find('.viewButton').click()
        cy.contains('otsikko2 kirjoittaja2').parent().find('.likeButton').click()
        cy.visit('')
        cy.contains('otsikko2 kirjoittaja2').parent().find('.viewButton').click()
        cy.contains('otsikko2 kirjoittaja2').parent().find('.likeButton').click()
        cy.get('.blog').eq(0).should('contain', 'otsikko2 kirjoittaja2')
      })
    })
  })
})