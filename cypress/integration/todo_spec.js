describe('Todo App', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000') // Passen Sie die URL an Ihre lokale Entwicklungsumgebung an
    })
  
    it('should load the todo app', () => {
      cy.get('h1').should('contain', 'Todo Liste')
      cy.get('form').should('exist')
      cy.get('#todo-list').should('exist')
    })
  
    it('should add a new todo', () => {
      const todoText = 'Neue Aufgabe'
      cy.get('input[name="title"]').type(todoText)
      cy.get('input[name="due"]').type('2025-01-01')
      cy.get('select[name="status"]').select('offen')
      cy.get('form').submit()
  
      cy.get('#todo-list .todo').last().should('contain', todoText)
    })
  
    it('should update todo status', () => {
      cy.get('#todo-list .todo').first().within(() => {
        cy.get('.status').click()
        cy.get('.status').should('contain', 'in Bearbeitung')
      })
    })
  
    it('should edit a todo', () => {
      const newTitle = 'Bearbeitete Aufgabe'
      cy.get('#todo-list .todo').first().within(() => {
        cy.get('.edit').click()
        cy.get('input[name="title"]').clear().type(newTitle)
        cy.get('form').submit()
      })
      cy.get('#todo-list .todo').first().should('contain', newTitle)
    })
  
    it('should delete a todo', () => {
      cy.get('#todo-list .todo').its('length').then((initialLength) => {
        cy.get('#todo-list .todo').first().within(() => {
          cy.get('.delete').click()
        })
        cy.get('#todo-list .todo').should('have.length', initialLength - 1)
      })
    })
  
    it('should handle API errors gracefully', () => {
      cy.intercept('POST', '/todos', { statusCode: 500, body: { error: 'Server Error' } }).as('createTodoError')
      
      const todoText = 'Fehlerhafte Aufgabe'
      cy.get('input[name="title"]').type(todoText)
      cy.get('input[name="due"]').type('2025-01-01')
      cy.get('select[name="status"]').select('offen')
      cy.get('form').submit()
  
      cy.wait('@createTodoError')
      cy.contains('Fehler beim Erstellen des Todos').should('be.visible')
    })
  })