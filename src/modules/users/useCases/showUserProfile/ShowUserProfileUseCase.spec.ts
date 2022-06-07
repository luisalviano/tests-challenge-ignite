import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "Test User",
      email: "user@test.com",
      password: "1234"
    });

    const response = await showUserProfileUseCase.execute(user.id!);
    
    expect(response).toHaveProperty("id");
  });

  it("should not be able to show profile of nonexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute('nonexistent_id');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});