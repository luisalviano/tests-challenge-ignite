<h1 align="center">🚀 Challenge #6 - Unit & Integration tests 🚀</h1>

<p align="center">This is the sixth challenge from <a href="https://www.rocketseat.com.br/ignite">Rocketseat's Ignite</a> Node.js bootcamp.</p>

<p align="center">
  <a href="#about-the-challenge">About</a> •
  <a href="#technologies">Technologies</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#routes">Routes</a> •
  <a href="#running-the-tests">Tests<a>
</p>

<p id="insomnia" align="center">
  <a href="" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

## About the challenge

In progress...

## Technologies

- [Node.js](https://nodejs.org/en/)
- [Express](http://expressjs.com/)
- [TypeORM]()
- [JWT](https://jwt.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Jest](https://jestjs.io/)
- [Supertest](https://www.npmjs.com/package/supertest)

## Getting Started

Clone this repository and access the folder:
```
$ git clone https://github.com/marialuizams/tests-challenge-ignite.git
$ cd tests-challenge-ignite
```
Install dependencies using:
```
$ yarn
# or
$ npm install
```

Start the app by running:
```
$ yarn dev
```
The application should start running on http://localhost:3333.

Import the `insomnia.json` file on the Insomnia app, or click the [Run in Insomnia](#insomnia) button.

## Routes

### POST `/api/v1/users`

This route should receive the user's `name`, `email` and `password` via request body, and return an empty response with status `201`.

### POST `/api/v1/sessions`

This route should receive an `email` and `password` via request body, and returns the authenticated user data as well as the JWT token.

### GET `/api/v1/profile`

This route should receive a JWT token via request header and returns the authenticated user information.

### GET `/api/v1/statements/balance`

This route should receive a JWT token via request header and return a list with all the deposit and withdraw operations made by the authenticated user, as well as the user's balance.

### POST `/api/v1/statements/deposit`

This route receives the deposit's `amount` and `description` via request body, and a JWT token via request header. The route should register the deposit operation and return the deposit information with a `201` status.

### POST `/api/v1/statements/withdraw`

This route receives the withdraw's `amount` and `description` via request body, and a JWT token via request header. The route should register the withdraw operation (if the user has sufficient funds), returning the withdraw information and a `201` status.

### GET `/api/v1/statements/:statement_id`

This route should receive the statement's `id` on the route URL and a JWT token via request body, and return the statement information (in case it's a valid statement).

## Running the tests
To run the tests using Jest:
```
$ yarn test
```

![Jest output](/assets/test_evidence.png)

#

<p align="center">Developed by <a href="https://www.linkedin.com/in/marialuizasalviano/">Maria Luiza Salviano</a></p>