/// <reference types="Cypress"/>

describe('Board rendered properly with nine boxes in offline mode', () => {
    it('nine buttons rendered properly', () => {
      cy.visit('/')
      // Navigate to Offline mode
      cy.get('.inner > :nth-child(2)').click();

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

describe('Button interactions in offline mode', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('.inner > :nth-child(2)').click();
    });

    it('alternates text content on click', () => {
      
      cy.get('.square').eq(0).click()
      cy.get('.square').eq(0).invoke('text').should('match', /\s*X\s*/)
  
      cy.get('.square').eq(5).click()
      cy.get('.square').eq(5).invoke('text').should('match', /\s*O\s*/)
  
      cy.get('.square').eq(7).click()
      cy.get('.square').eq(7).invoke('text').should('match', /\s*X\s*/)
  
      cy.get('.square').eq(1).click()
      cy.get('.square').eq(1).invoke('text').should('match', /\s*O\s*/)
    })


    it('alternates background-color on hover', () => {
    cy.get('.square').eq(5).trigger('mouseover').should('have.class', 'xHover');
    cy.get('.square').eq(5).click()
    cy.get('.square').eq(7).trigger('mouseover').should('have.class', 'oHover');
    cy.get('.square').eq(7).click()
    cy.get('.square').eq(1).trigger('mouseover').should('have.class', 'xHover');
    cy.get('.square').eq(1).click()
    cy.get('.square').eq(0).trigger('mouseover').should('have.class', 'oHover');
    })
})

// Define a function to simulate a game where X wins
const simulateXWinGame = () => {
    cy.get('#0').then(($currentPlayer) => {
        const currentPlayerClass = $currentPlayer.hasClass('xHover');

        // Determine the moves based on current player
        if (currentPlayerClass) {
            // If current player is X, ensure X wins
            cy.get('#0').click(); 
            cy.get('#3').click(); 
            cy.get('#1').click(); 
            cy.get('#4').click(); 
            cy.get('#2').click(); 
        } else {
            // If current player is O, then also ensure X wins
            cy.get('#0').click(); 
            cy.get('#3').click(); 
            cy.get('#1').click(); 
            cy.get('#4').click(); 
            cy.get('#6').click(); 
            cy.get('#5').click(); 
        }
    }); 
};

// Define a function to simulate a game where O wins
const simulateOWinGame = () => {
    cy.get('#0').then(($currentPlayer) => {
        const currentPlayerClass = $currentPlayer.hasClass('oHover');

        // Determine the moves based on current player
        if (currentPlayerClass) {
            // If current player is O, ensure O wins
            cy.get('#0').click(); 
            cy.get('#3').click(); 
            cy.get('#1').click(); 
            cy.get('#4').click(); 
            cy.get('#2').click(); 
        } else {
            // If current player is X, then also ensure O wins
            cy.get('#0').click(); 
            cy.get('#3').click(); 
            cy.get('#1').click(); 
            cy.get('#4').click(); 
            cy.get('#6').click(); 
            cy.get('#5').click();
        }
    }); 
};

// Define a function to simulate a draw game
const simulateDrawGame = () => {
  cy.get('#0').click(); 
  cy.get('#1').click(); 
  cy.get('#2').click(); 
  cy.get('#4').click(); 
  cy.get('#3').click(); 
  cy.get('#5').click(); 
  cy.get('#7').click(); 
  cy.get('#6').click(); 
  cy.get('#8').click(); 
};

describe('ScoreBoard rendered & worked properly', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('.inner > :nth-child(2)').click();
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
    
    it("verify scores persist after 'Play Again' click (should not reset to 0)", () => {
      simulateXWinGame();
      cy.get('.modalBtn').click()
      // Ensure the score should not reset to 0
      cy.get('.forX').should('contain', 'Score - 1');

      simulateOWinGame()
      cy.get('.modalBtn').click()
      simulateOWinGame()
      cy.get('.modalBtn').click()
      // Ensure the score should not reset to 0
      cy.get('.forO').should('contain', 'Score - 2');

      simulateDrawGame()
      cy.get('.modalBtn').click()
      // Ensure the score should not reset to 0
      cy.get('.forDraw').should('contain', 'Ties - 1');
    });
})
  
describe('Verify Popup Appearance and Functionality', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.get('.inner > :nth-child(2)').click()
    });
  
    it('Should display popup with winner message after X wins', () => {
      simulateXWinGame()
  
      cy.get('.modal').should('be.visible');
      cy.get('.modal h6').should('contain', 'Winner!');
      cy.get('.modal button.winnerX').should('exist');
      cy.get('.modal button.modalBtn').should('contain', 'Play again');
    });
  
    it('Should display popup with winner message after O wins', () => {
      simulateOWinGame()
  
      cy.get('.modal').should('be.visible');
      cy.get('.modal h6').should('contain', 'Winner!');
      cy.get('.modal button.winnerO').should('exist');
      cy.get('.modal button.modalBtn').should('contain', 'Play again');
    });
  
    it('Should display popup on game over with draw message', () => {
      simulateDrawGame()
  
      cy.get('.modal').should('be.visible');
      cy.get('.modal h6').should('contain', 'Draw!');
      cy.get('.modal button.winnerX').should('exist');
      cy.get('.modal button.winnerO').should('exist');
      cy.get('.modal button.modalBtn').should('contain', 'Play again');
    });
  
    it('Popup should close and Players Can Replay Upon Clicking "Play Again" Button', () => {
      simulateOWinGame()
      cy.get('.modal button.modalBtn').contains('Play again').click();
  
      cy.get('.modal').should('not.exist');
      cy.get('.forX').should('contain', 'Score - 0');
      cy.get('.forO').should('contain', 'Score - 1');
      cy.get('.forDraw').should('contain', 'Ties - 0');
      simulateXWinGame()
    });
  
    it('Should not close popup when clicking outside the modal', () => {
      simulateDrawGame()
  
      // Click outside the modal
      cy.get('.modal-overlay').click('topRight');
      // Click inside the modal
      cy.get('.modal').click({ force: true });
      // assert modal is not closed
      cy.get('.modal').should('be.visible');
    });
})

describe('verify Home button and Sound button functionality', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.get('.inner > :nth-child(2)').click()
    });

    it('should navigate to the home screen when the Home button is clicked', () => {
      // Ensure the home button exists
      cy.get('#homeBtn').should('exist');

      // Click the home button and verify the home page rendered
      cy.get('#homeBtn').click();
      cy.get('.button-container').should('exist');
      cy.get('.inner > :nth-child(1)').should('contain', 'Play Online');
    })

    it('should toggle the sound button icon between high volume and mute', () => {
      // Ensure the sound button exists
      cy.get('#soundBtn').should('exist');

      // Click the sound button and verify the class toggles to 'fa-volume-high'
      cy.get('#soundBtn').click();
      cy.get('#soundBtn svg').should('have.class', 'fa-volume-high');

      // Click the sound button again and verify the class toggles back to 'fa-volume-xmark'
      cy.get('#soundBtn').click();
      cy.get('#soundBtn svg').should('have.class', 'fa-volume-xmark');
    });
})