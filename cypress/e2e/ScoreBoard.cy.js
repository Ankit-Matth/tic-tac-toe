/// <reference types="Cypress"/>

// Define a function to simulate a game where X wins
const simulateXWinGame = () => {
    cy.get('#0').click(); // X
    cy.get('#3').click(); // O
    cy.get('#1').click(); // X
    cy.get('#4').click(); // O
    cy.get('#2').click(); // X
};

// Define a function to simulate a game where O wins
const simulateOWinGame = () => {
  cy.get('#0').click(); // X
  cy.get('#3').click(); // O
  cy.get('#1').click(); // X
  cy.get('#4').click(); // O
  cy.get('#6').click(); // X
  cy.get('#5').click(); // O
};

// Define a function to simulate a draw game
const simulateDrawGame = () => {
  cy.get('#0').click(); // X
  cy.get('#1').click(); // O
  cy.get('#2').click(); // X
  cy.get('#4').click(); // O
  cy.get('#3').click(); // X
  cy.get('#5').click(); // O
  cy.get('#7').click(); // X
  cy.get('#6').click(); // O
  cy.get('#8').click(); // X
};
  

describe('ScoreBoard rendered & worked properly', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/tic-tac-toe')
    });

    it('scoreBoard rendered properly', () => {
      // Check if there is a .scoreBoard div
      cy.get('.scoreBoard').should('exist')
    })

    it('renders initial scores correctly', () => {
        cy.get('.forX').should('contain', 'Score - 0');
        cy.get('.forO').should('contain', 'Score - 0');
        cy.get('.forDraw').should('contain', 'Ties - 0');
    });
    
      it('changes score color alternately to indicate active player', () => {
        cy.get('.forX').should('have.css', 'color', 'rgb(255, 0, 0)');
        cy.get('.forO').should('have.css', 'color', 'rgb(0, 0, 0)');
        cy.get('#3').click();
        cy.get('.forX').should('have.css', 'color', 'rgb(0, 0, 0)');
        cy.get('.forO').should('have.css', 'color', 'rgb(0, 0, 255)');
        cy.get('#5').click();
        cy.get('.forX').should('have.css', 'color', 'rgb(255, 0, 0)');
        cy.get('.forO').should('have.css', 'color', 'rgb(0, 0, 0)');
        cy.get('#0').click();
        cy.get('.forX').should('have.css', 'color', 'rgb(0, 0, 0)');
        cy.get('.forO').should('have.css', 'color', 'rgb(0, 0, 255)');
      });
    
      it('updates scores correctly after X wins', () => {
        // Call the function to simulate a game where X wins
        simulateXWinGame();
    
        // Ensure X score is updated, other scores remain the same
        cy.get('.forX').should('contain', 'Score - 1');
        cy.get('.forO').should('contain', 'Score - 0');
        cy.get('.forDraw').should('contain', 'Ties - 0');
      });
    
      it('updates scores correctly after O wins', () => {
        // Call the function to simulate a game where O wins
        simulateOWinGame();
    
        // Ensure O score is updated, other scores remain the same
        cy.get('.forX').should('contain', 'Score - 0');
        cy.get('.forO').should('contain', 'Score - 1');
        cy.get('.forDraw').should('contain', 'Ties - 0');
      });
    
      it('updates scores correctly after a draw game', () => {
        // Call the function to simulate a draw game
        simulateDrawGame();
    
        // Ensure tie score is updated, other scores remain the same
        cy.get('.forX').should('contain', 'Score - 0');
        cy.get('.forO').should('contain', 'Score - 0');
        cy.get('.forDraw').should('contain', 'Ties - 1');
      });
    
      it('resets scores correctly after clicking Restart Game', () => {
        simulateXWinGame();
        cy.get('.modalBtns').eq(0).click()
        simulateXWinGame()
        cy.get('.modalBtns').eq(0).click()
        simulateDrawGame()

        cy.get('.modalBtns').eq(1).click()
        
        // Ensure the score reset to 0 after clicking Restart
        cy.get('.forX').should('contain', 'Score - 0');
        cy.get('.forO').should('contain', 'Score - 0');
        cy.get('.forDraw').should('contain', 'Ties - 0');
      });
})