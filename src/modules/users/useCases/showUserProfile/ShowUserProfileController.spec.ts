import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database"

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
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

    const response = await request(app).get("/api/v1/profile")
      .send()
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to show profile of non-authenticated user", async () => {
    const response = await request(app).get("/api/v1/profile")
      .send()
      .set({ Authorization: `Bearer ` });
    
    expect(response.status).toBe(401);
  });
});