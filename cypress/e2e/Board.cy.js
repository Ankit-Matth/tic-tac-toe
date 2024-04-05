/// <reference types="Cypress"/>

describe('Board rendered properly with nine boxes/buttons', () => {
    it('renders nine buttons', () => {
      cy.visit('http://localhost:3000/tic-tac-toe')

      // Check if there is a .board div
      cy.get('.board').should('exist')

      // Check if there are exactly nine div boxes inside .board
      cy.get('.board div').should('have.length', 9)

      // Check if each div box contains one button
      cy.get('.board div').each(($div) => {
        cy.wrap($div).find('.square').should('exist')
      })
    })
})