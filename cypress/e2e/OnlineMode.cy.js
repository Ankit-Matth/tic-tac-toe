/// <reference types="Cypress"/>

describe('Checking login functionality in online mode', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.get('.inner > :nth-child(1)').click();
    });

    it('verify login page renders successfully', () => {
        cy.get('h2').contains('Welcome to Online Mode').should('be.visible');
        cy.get('p').contains('To play online, you must sign in with your Google account.').should('be.visible');
        cy.get('button').contains('Back to Home').should('be.visible');
    })

    it('successfully log in with Google and display the profile information', () => {
        cy.loginWithGoogle();

        cy.fixture('users').then((users) => {
            const userData = users.userData;
            cy.get('.user-info').should('be.visible');
            cy.get('.user-info').within(() => {
                cy.contains(`Hello ${userData.name}`).should('be.visible');
                cy.contains('Welcome to your profile.').should('be.visible');
            });
        });
    })
})

describe('Checking room joining functionality', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('.inner > :nth-child(1)').click();
        cy.loginWithGoogle();
        cy.fixture('users.json').as('users');  // Load the fixture and alias it as 'users'
    });

    it('display error on joining with empty room code', () => {
        cy.contains('Join Room').click();
        cy.get('.error-message').should('contain', '*Please enter a room code to join the room.');
    })

    it('user successfully joins the room with a valid code', () => {
        cy.get('@users').then((users) => {
            cy.get('input[placeholder="Enter a room code"]').type(users.userData.joinedRoomCode);
            cy.contains('Join Room').click();
            cy.get('.room-joined').should('contain', `Room number: ${users.userData.joinedRoomCode}`);
        });
    })

    it('exit from room functionality test', () => {
        cy.get('@users').then((users) => {
            cy.get('input[placeholder="Enter a room code"]').type(users.userData.joinedRoomCode);
            cy.contains('Join Room').click();

            cy.contains('Exit from Room').click();
            cy.contains(`Hello ${users.userData.name}`).should('be.visible');
            cy.contains('Welcome to your profile.').should('be.visible');
        });
    });

    it('logout functionality test', () => {
        cy.get('@users').then((users) => {
            cy.get('input[placeholder="Enter a room code"]').type(users.userData.joinedRoomCode);
            cy.contains('Join Room').click();

            cy.contains('Logout').click();
            cy.contains('To play online, you must sign in with your Google account.').should('be.visible');
        });
    });
});

describe('Verify game starting functionality in online mode', () => {
    let user1Socket;
    let user2Socket;
    let userData;
    let opponentData;

    beforeEach(() => {
        cy.visit('/');
        cy.get('.inner > :nth-child(1)').click();
        cy.loginWithGoogle();
    
        // Load the fixture data
        cy.fixture('users.json').then((data) => {
            userData = data.userData;
            opponentData = data.opponentData;
    
            cy.get('input[placeholder="Enter a room code"]').type(userData.joinedRoomCode);
            cy.contains('Join Room').click();
    
            cy.getSocket().then((socket) => {
                user1Socket = socket;
            });
        });
    });
    
    afterEach(() => {
        // Disconnect sockets after each test case
        if (user1Socket) {
            user1Socket.disconnect();
        }
        if (user2Socket) {
            user2Socket.disconnect();
        }
    });

    it('initially, there is only one participant in the room, and the user cannot initiate the game', () => {
        // Check that there is initially one participants
        cy.get('.participants').should('have.length', 1);

        // Attempt to start the game
        cy.contains('Start the Game').click();
        cy.get('.error-message').should('contain', '*Please wait for a opponent...')
    });

    it('handle opponent found and left scenarios', () => {
        cy.getSocket().then((mainSocket) => {
            cy.createOpponentConnection(opponentData.joinedRoomCode).then((opponentSocket) => {
                user2Socket = opponentSocket;

                // Check that opponent is visible
                cy.get('[style="margin-top: 0.8rem;"] > .role').should('contain', '(Opponent)');

                cy.wait(100);

                // Disconnect the opponent socket
                cy.wrap(
                    new Promise((resolve) => {
                        opponentSocket.disconnect();
                        resolve();
                    })
                ).then(() => {
                    mainSocket.emit("OpponentLeftTheMatch");

                    // Check the error message
                    cy.get('.error-message').should('contain', 'Opponent left the room...');
                });
            });
        });
    });

    it('should start the game after joining an opponent and play alternately', () => {
        cy.getSocket().then((mainSocket) => {
            cy.createOpponentConnection(opponentData.joinedRoomCode).then((opponentSocket) => {
                user2Socket = opponentSocket;

                cy.wait(10);
                cy.contains('Start the Game').click();
                cy.wait(10);
                cy.get('.overlay').should('contain', 'Choose a icon:');
                cy.get('.cross').click();

                cy.get('.left > h5').should('contain', `${userData.name}`);
                cy.get('.left > img').should('have.attr', 'src').and('contain', userData.picture);
                cy.get('.right > img').should('have.attr', 'src').and('contain', `${opponentData.picture}`);
                cy.get('.right > h5').should('contain', `${opponentData.name}`);
                cy.get('.playerTurn').should('contain', 'Your Turn');

                // Stub the alert function
                const stub = cy.stub();
                cy.on('window:alert', stub);

                cy.get('.square').eq(1).click();

                // Check if the alert was called with the correct message
                cy.wrap(stub).should('be.calledWith', "Please wait, your opponent still hasn't started the game.");

                cy.then(() => {
                    opponentSocket.emit('request_to_start', {
                        choosePlayerIcon: "circle"
                    });
                });

                cy.get('.square').eq(1).click();
                cy.get('.square').eq(1).invoke('text').should('match', /\s*X\s*/);

                cy.get('.playerTurn').should('contain', "Waiting for opponent's move");

                // Stub the alert function
                const innerStub = cy.stub();
                cy.on('window:alert', innerStub);

                cy.get('.square').eq(0).click();

                // Check if the alert was called with the correct message
                cy.wrap(innerStub).should('be.calledWith', "Waiting for opponent's move");

                cy.then(() => {
                    opponentSocket.emit('playerMoveFromClient', {
                        clientBoard: [
                            'O', 'X', null,
                            null, null, null,
                            null, null, null
                        ],
                        clientIsXPlaying: true,
                    });
                });

                cy.get('.square').eq(3).click();
                cy.get('.square').eq(3).invoke('text').should('match', /\s*X\s*/);

                cy.then(() => {
                    opponentSocket.disconnect()
                });
            });
        });
    });

    it('automatic game Initiation upon opponent action, enabling the user to play alternately with the opponent', () => {
        cy.getSocket().then((mainSocket) => {
            cy.createOpponentConnection(opponentData.joinedRoomCode).then((opponentSocket) => {
                user2Socket = opponentSocket;

                opponentSocket.emit('request_to_start', {
                    choosePlayerIcon: "cross"
                });

                cy.get('.overlay').should('contain', 'Choose a icon:');
                cy.get('.cross').click();

                cy.get('.error-message').should('contain', `Sorry, this has been selected by ${opponentData.name}`);

                cy.get('.circle').click();

                cy.get('.left > h5').should('contain', `${userData.name}`);
                cy.get('.left > img').should('have.attr', 'src').and('contain', userData.picture);
                cy.get('.right > img').should('have.attr', 'src').and('contain', `${opponentData.picture}`);
                cy.get('.right > h5').should('contain', `${opponentData.name}`);
                cy.get('.playerTurn').should('contain', "Waiting for opponent's move");

                // Stub the alert function
                const stub = cy.stub();
                cy.on('window:alert', stub);

                cy.get('.square').eq(1).click();

                // Check if the alert was called with the correct message
                cy.wrap(stub).should('be.calledWith', "Waiting for opponent's move");

                cy.then(() => {
                    opponentSocket.emit('playerMoveFromClient', {
                        clientBoard: [
                            'X', null, null,
                            null, null, null,
                            null, null, null
                        ],
                        clientIsXPlaying: false,
                    });
                });

                cy.get('.playerTurn').should('contain', "Your Turn");

                // Stub the alert function
                const otherStub = cy.stub();
                cy.on('window:alert', otherStub);

                cy.get('.square').eq(5).click();

                // Check if the alert was called with the correct message
                cy.wrap(otherStub).should('be.calledWith', "Waiting for opponent's move");

                cy.get('.playerTurn').should('contain', "Waiting for opponent's move");
            });
        });
    });
})

describe('Verify Quit Game and sound button functionality in online mode', () => {
    let mainSocket;
    let opponentSocket;

    beforeEach(() => {
        cy.visit('/');
        cy.get('.inner > :nth-child(1)').click();
        cy.loginWithGoogle();
    
        // Load fixture data
        cy.fixture('users.json').as('users');
    
        cy.get('@users').then((users) => {
            cy.get('input[placeholder="Enter a room code"]').type(users.userData.joinedRoomCode);
            cy.contains('Join Room').click();
    
            cy.getSocket().then((socket) => {
                mainSocket = socket;
    
                cy.createOpponentConnection(users.opponentData.joinedRoomCode).then((socket) => {
                    opponentSocket = socket;
                    cy.wait(10);
                    cy.contains('Start the Game').click();
                    cy.wait(10);
                    cy.get('.overlay').should('contain', 'Choose a icon:');
                    cy.get('.cross').click();
                });
            });
        });
    });

    afterEach(() => {
        // Disconnect sockets after each test
        if (opponentSocket) {
            opponentSocket.disconnect();
        }
        if (mainSocket) {
            mainSocket.disconnect();
        }
    });

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

    it('should terminate the game and navigate to the user-info section', () => {
         // Use the fixture data
         cy.get('@users').then((users) => {
            const userData = users.userData;

            cy.get('#homeBtn').click();

            cy.get('.user-info').should('be.visible');
            cy.get('.user-info').within(() => {
                cy.contains(`Hello ${userData.name}`).should('be.visible');
                cy.contains('Welcome to your profile.').should('be.visible');
            });
        });
    });
});