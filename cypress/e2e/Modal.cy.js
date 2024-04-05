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

describe('Modal Component', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/tic-tac-toe')
  });

  it('Should display modal with winner message after X wins', () => {
    simulateXWinGame()

    cy.get('.modal').should('be.visible');
    cy.get('.modal h2').should('contain', 'Winner!');
    cy.get('.modal button.winnerX').should('exist');
    cy.get('.modal button.modalBtns').eq(0).should('contain', 'Play again');
    cy.get('.modal button.modalBtns').eq(1).should('contain', 'Restart');
  });

  it('Should display modal with winner message after O wins', () => {
    simulateOWinGame()

    cy.get('.modal').should('be.visible');
    cy.get('.modal h2').should('contain', 'Winner!');
    cy.get('.modal button.winnerO').should('exist');
    cy.get('.modal button.modalBtns').eq(0).should('contain', 'Play again');
    cy.get('.modal button.modalBtns').eq(1).should('contain', 'Restart');
  });

  it('Should display modal on game over with draw message', () => {
    simulateDrawGame()

    cy.get('.modal').should('be.visible');
    cy.get('.modal h2').should('contain', 'Draw!');
    cy.get('.modal button.winnerX').should('exist');
    cy.get('.modal button.winnerO').should('exist');
    cy.get('.modal button.modalBtns').eq(0).should('contain', 'Play again');
    cy.get('.modal button.modalBtns').eq(1).should('contain', 'Restart');
  });

  it('Modal should close and Game Restarts when "Restart" button is clicked', () => {
    simulateXWinGame()
    cy.get('.modal button.modalBtns').contains('Restart').click();

    cy.get('.modal').should('not.exist');
    cy.get('.forX').should('contain', 'Score - 0');
    cy.get('.forO').should('contain', 'Score - 0');
    cy.get('.forDraw').should('contain', 'Ties - 0');
  });

  it('Modal should close and Players Can Replay Upon Clicking "Play Again" Button', () => {
    simulateOWinGame()
    cy.get('.modal button.modalBtns').contains('Play again').click();

    cy.get('.modal').should('not.exist');
    cy.get('.forX').should('contain', 'Score - 0');
    cy.get('.forO').should('contain', 'Score - 1');
    cy.get('.forDraw').should('contain', 'Ties - 0');
    simulateXWinGame()
  });

  it('Should not close modal when clicking outside the modal', () => {
    simulateDrawGame()

    // Click outside the modal
    cy.get('.modal-overlay').click('topRight');
    // Click inside the modal
    cy.get('.modal').click({ force: true });
    // assert modal is not closed
    cy.get('.modal').should('be.visible');
  });

})