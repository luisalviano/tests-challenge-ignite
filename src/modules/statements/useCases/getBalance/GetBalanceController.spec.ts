import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database"

let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user's balance", async () => {
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
    
    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 310,
        description: "Supertest Deposit"
      })
      .set({ Authorization: `Bearer ${token}` });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });

  it("should not be able to get balance of a non-authenticated user", async () => {
    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ` });

    expect(response.status).toBe(401);
  });
});