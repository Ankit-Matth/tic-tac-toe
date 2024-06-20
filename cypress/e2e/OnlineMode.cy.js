/// <reference types="Cypress"/>

describe('Online Mode', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/tic-tac-toe')
        cy.get('.inner > :nth-child(1)').click();
    });
})