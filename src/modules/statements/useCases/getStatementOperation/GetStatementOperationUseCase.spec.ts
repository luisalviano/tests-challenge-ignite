import { OperationType, Statement } from "../../entities/Statement";

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get statement operation", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "user@test.com",
      password: "test"
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 270,
      description: "Test description"
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id!,
      statement_id: statement.id!
    });

    expect(response).toBeInstanceOf(Statement);
    expect(response).toHaveProperty("id");
  });

  it("should not be able to get statement operation of invalid user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "invalid_id",
        statement_id: ""
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to get nonexistent statement operation", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "Test User",
        email: "user@test.com",
        password: "test"
      });
  
      await getStatementOperationUseCase.execute({
        user_id: user.id!,
        statement_id: "nonexistent_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})