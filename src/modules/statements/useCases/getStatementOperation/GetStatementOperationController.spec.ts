import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";

import createConnection from "../../../../database"

let connection: Connection;

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get statement information", async () => {
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
    
    const statementResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 310,
        description: "Supertest Deposit"
      })
      .set({ Authorization: `Bearer ${token}` });

    const { id } = statementResponse.body;

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(200);
  });

  it("should not be able to get statement information from non-authenticated user", async () => {
    const id = "6b8d8eb0-2afb-478e-b0d7-821cdd453e47";
    
    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ` });

    expect(response.status).toBe(401);
  });

  it("should not be able to get nonexistent statement operation", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@supertest.com",
        password: "supertest"
      });
    
    const { token } = responseToken.body;

    const id = "6b8d8eb0-2afb-478e-b0d7-821cdd453e47";

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(response.status).toBe(404);
  })
});