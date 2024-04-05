/// <reference types="Cypress"/>

describe('Button interactions', () => {
  it('alternates text content on click', () => {
    cy.visit('http://localhost:3000/tic-tac-toe')
    
    cy.get('.square').eq(0).click()
    cy.get('.square').eq(0).invoke('text').should('match', /\s*X\s*/)

    cy.get('.square').eq(5).click()
    cy.get('.square').eq(5).invoke('text').should('match', /\s*O\s*/)

    cy.get('.square').eq(7).click()
    cy.get('.square').eq(7).invoke('text').should('match', /\s*X\s*/)

    cy.get('.square').eq(1).click()
    cy.get('.square').eq(1).invoke('text').should('match', /\s*O\s*/)
  })
})
