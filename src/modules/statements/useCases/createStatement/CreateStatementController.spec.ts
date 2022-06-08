import { response } from "express";
import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database"

let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a deposit statement", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "user@supertest.com",
        password: "supertest"
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@supertest.com",
        password: "supertest"
      });
    
    const { token } = responseToken.body;
    
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 310,
        description: "Supertest Deposit"
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  it("should be able to create a withdraw statement", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "user@supertest.com",
        password: "supertest"
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@supertest.com",
        password: "supertest"
      });
    
    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 40,
        description: "Supertest Withdraw"
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a withdraw if the user has insufficient balance", async () => {
    await request(app)
      .post("/api/v1/users")
      .send({
        name: "User Supertest",
        email: "user@supertest.com",
        password: "supertest"
      });

    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@supertest.com",
        password: "supertest"
      });
    
    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 500,
        description: "Supertest Withdraw"
      })
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(400);
  });

  it("should not be able to create a statement if user is not authenticated", async () => {
    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 20,
        description: "Supertest Deposit"
      })
      .set({ Authorization: `Bearer ` });

    expect(response.status).toBe(401);
  })
});