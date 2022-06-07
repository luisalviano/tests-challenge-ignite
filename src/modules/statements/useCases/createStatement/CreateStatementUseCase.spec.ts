import { OperationType } from "../../entities/Statement"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement",() => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to create a deposit", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "user@test.com",
      password: "4312"
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "Test Deposit"
    });

    expect(response).toHaveProperty("id");
    expect(response.type).toBe(OperationType.DEPOSIT);
  });

  it("should be able to create a withdraw", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "user@test.com",
      password: "4312"
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 300,
      description: "Test Deposit"
    });

    const response = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 230,
      description: "Test Withdraw"
    });

    expect(response).toHaveProperty("id");
    expect(response.type).toBe(OperationType.WITHDRAW);
  });

  it("should not be able to create a new statement to a nonexistent user", () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "nonexistent_id",
        type: OperationType.DEPOSIT,
        amount: 300,
        description: "Test Description"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able to create a withdraw with insufficient funds", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "User 1",
        email: "user1@test.com",
        password: "4451"
      });
    
      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 300,
        description: "Test Withdraw"
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});