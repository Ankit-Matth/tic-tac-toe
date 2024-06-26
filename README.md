# Tic Tac Toe

While exploring the official documentation of React.js, I got an idea to create a Tic Tac Toe game since all the necessary details for the game were provided there. Consequently, I decided to apply my React.js knowledge to develop this game. Furthermore, I expanded its functionality to support multiplayer online play using **socket.io**, enabling users to compete with friends remotely, and also incorporated `Sign-in with Google` using **@react-oauth/google**. To ensure its reliability, I integrated end-to-end testing using Cypress, ensuring its functionality through rigorous testing. Through hands-on implementation, I gained a solid understanding of leveraging React's capabilities for efficient component rendering and dynamic state updates. Additionally, integrating Cypress for end-to-end testing provided me with insights into ensuring comprehensive test coverage and reliable functionality across the entire application.

## Quick Demo

- **Live link** - https://ankit-matth.github.io/tic-tac-toe/

https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/6f1c27e7-0874-4cea-a506-577b6ec205e7


## End-to-End Testing with Cypress
To ensure the reliability and coverage of the application, I implemented end-to-end testing using Cypress. Below are screenshots of the e2e test suites and test cases:

![Test Suites of OfflineMode - Part 1](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/8e478868-95bd-4845-8d99-b940387e3f40)
![Test Suites of OfflineMode - Part 2](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/3497d300-375e-416e-ac9e-d33b80222558)
![OfflineMode cy js Result](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/75ad8a8b-b77a-4429-ae95-71ebb29d5ee3)
![All Test Suites of OnlineMode](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/a9a26410-abd6-478a-91ec-115c83c4415d)
![OnlineMode cy js Result](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/e1f45ea7-fb26-40a0-a5bd-1f14975c4775)
![All Specs Result](https://github.com/Ankit-Matth/tic-tac-toe/assets/146843890/2cf0309e-672c-4bfc-937f-489372e83883)

## Technologies Used

1. React.js
2. HTML, CSS, JavaScript
3. JSX (JavaScript Syntax Extension)
4. Socket.io for online mode
5. Cypress for End-to-End Testing

Creating the Tic-Tac-Toe game using React.js, incorporating socket.io for multiplayer online play, supporting both offline and online play modes, and integrating end-to-end testing with Cypress felt like going on a coding adventure where every line of code taught me something new. Throughout this process, I focused primarily on React.js, deepening my understanding of concepts like Hooks and state management in React. Additionally, I added some animations and sound effects to make this game look cooler and more attractive. This project not only strengthened my proficiency in React but also provided valuable insights into comprehensive test coverage through e2e testing. Additionally, I gained a solid understanding of socket.io and web sockets. Overall, this project wasn't just coding; it was a hands-on learning journey that significantly contributed to my growth as a web developer. 

## Getting Started 

**Note:** *Make sure Node.js (npm) is installed before proceeding.*

Follow the steps below to install and run the project on your local machine.

**1. Clone this repository:**
  ```bash
  git clone https://github.com/Ankit-Matth/tic-tac-toe.git
  ```
**2. Go to the project directory:**
  ```bash
  cd tic-tac-toe
  ```
**3. Install dependencies for the frontend:**
  ```bash
  npm install
  ```
**4. Navigate to the backend directory:**
  ```bash
  cd server
  ```
**5. Install dependencies for the backend:**
  ```bash
  npm install
  ```
**6. Start the backend server:**
  ```bash
  npm start
  ```
**7. Start the backend server in development mode:**
  ```bash
  npm run dev
  ```
**8. Navigate back to the frontend directory:**
  ```bash
  cd ..
  ```
**9. Start the development server for ReactJS:**
  ```bash
  npm start
  ```
**10. Visit `http://localhost:3000/tic-tac-toe` to see the magic.**

### Below are the commands to execute the end-to-end tests:

**1. Install Cypress:**
  ```bash
  npm install cypress --save-dev
  ```
Note: There is no need for the above command if you have run `npm install` during the setup of the project.

**2. Open Cypress:**
  ```bash
  npm run cy:open
  ```
**3. Run Cypress tests:**
  ```bash
  npm run cy:run
  ```
