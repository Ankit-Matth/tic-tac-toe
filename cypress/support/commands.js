Cypress.Commands.add('loginWithGoogle', () => {
    // Mock the Google user information
    const mockCredentialResponse = {
        credential: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjNkNTgwZjBhZjdhY2U2OThhMGNlZTdmMjMwYmNhNTk0ZGM2ZGJiNTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI3MTY0MDk2MTgxOC04azFuazB1NzRibWRmbTRkdW50MDlzZjM4YXR2ZDc4NC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjcxNjQwOTYxODE4LThrMW5rMHU3NGJtZGZtNGR1bnQwOXNmMzhhdHZkNzg0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTEyNzI3NTQ2MzExODEwMzcyODU4IiwiZW1haWwiOiJhbmtpdG1hdHRoMTAxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYmYiOjE3MTg5ODM1OTIsIm5hbWUiOiJBbmtpdCBNYXR0aCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKYTdnRE1LbXZSZFFhMGxsWVNLVkIzUGRrSTg1c1JXa016UVJybk1VZ3VJaVZQWVdVPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkFua2l0IiwiZmFtaWx5X25hbWUiOiJNYXR0aCIsImlhdCI6MTcxODk4Mzg5MiwiZXhwIjoxNzE4OTg3NDkyLCJqdGkiOiJlNGM4Y2FjOTZkMWIzZDM1NzlmYzU1NTEzNmIwNTdhODA4ODMzYWY2In0.FmJiq5CkTRZAu4in8TtDzbmLyAgP0ANvm_qmx06lT1QtesKBrhocPoM5XBdM061p35QNggSI742fYRXkQUopy5QclDHtyS4lbiKPgjfrd3fqRUQxQjOhDf2r6de--2aHf98Ouoerk6sz1IJLqf11ogSRPKqOxYbjU2nSjFbE1yccjV8XBD37aNmytuIYq4--o722RAI3_UW07lDqagP1e_t6NW24Xsex9dffk3qMooaleaBLVe3IQbh9bsnMV0CwPinawz1BugFvN2WLfJYPryOqaYb4I9_O0haAw9C9taj5Ctvp0lnRVYyZzpmNnUaLgSe6Fr4eB_ZlIy0LPCBT8Q'
    };

    // Call the handleLoginData function directly
    cy.window().then((win) => {
        win.handleLoginData(mockCredentialResponse);
    });
});

Cypress.Commands.add('getSocket', () => {
    return cy.window().its('socket');
});

import io from 'socket.io-client';

Cypress.Commands.add('createOpponentConnection', (roomCode) => {
    cy.wrap(
        new Promise((resolve) => {
            const opponentSocket = io('https://tic-tac-toe-7yf4.onrender.com');
            opponentSocket.on('connect', () => {
                const opponentData = {
                    name: 'Amit Matth',
                    email: 'amitmatth111@gmail.com',
                    picture: 'https://lh3.googleusercontent.com/a/ACg8ocJ_S0B8cmvYzF0BQ3hitgyTgO1HCkLWl2zNLL5pIOnMKF49Sg=s96-c'
                };

                opponentSocket.emit('request_to_play', {
                    playerData: {
                        ...opponentData,
                        joinedRoomCode: roomCode
                    }
                });

                // Resolve the promise once the opponent is visible
                resolve(opponentSocket);
            });
        })
    );
});