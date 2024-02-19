## Directory Structure

Organize your NestJS project by feature rather than by technical role. Each feature should reside in its own directory, containing all related modules, controllers, services, etc.

```
src/
├─ user/
│  ├─ dto/
│  ├─ entities/
│  ├─ user.controller.ts
│  ├─ user.module.ts
│  ├─ user.service.ts
├─ app.module.ts
```

## File Naming

- Use `kebab-case` for filenames.
- Suffix filenames with their type: `.module.ts`, `.controller.ts`, `.service.ts`, `.repository.ts`, etc.

## Modules

- Keep modules focused on a single feature or closely related features.
- Use `@Module()` decorator to organize imports, providers, controllers, and exports.

## Controllers

- Name controllers after their feature and use the `@Controller()` decorator to define routes.
- Keep controllers slim; focus on handling HTTP requests and delegating business logic to services.

```typescript
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }
}
```

## Services

- Implement business logic in services.
- Use the `@Injectable()` decorator to make services injectable.
- Handle data access and complex operations within services, keeping them decoupled from controllers.

## DTOs (Data Transfer Objects)

- Use DTOs to define the shape of data for incoming requests.
- Prefer classes over interfaces for DTOs to leverage class-validator and class-transformer packages.

```typescript
export class CreateUserDto {
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
```

## Entities

- Define entities for database models, aligning with the TypeORM or Sequelize ORM conventions used in your project.

## Dependency Injection

- Leverage NestJS's powerful DI container to decouple components.
- Use constructor injection for defining dependencies.

## Error Handling

- Use built-in exceptions (`NotFoundException`, `BadRequestException`, etc.) for common error types.
- Create custom exceptions for more specific error handling when necessary.

## Middleware, Guards, and Interceptors

- Use middleware for cross-cutting concerns like logging or request sanitization.
- Apply guards for authentication and authorization.
- Use interceptors for response mapping, logging, or attaching additional data to responses.

## Testing

- Write unit tests for services and providers, focusing on business logic.
- Use integration tests for controllers to ensure routes are correctly wired and responding as expected.
- Follow the Arrange-Act-Assert pattern to structure tests clearly.

## Formatting and Linting

- Use Prettier and ESLint with TypeScript support to enforce code style and formatting.
- Configure your linter to enforce best practices and consistent coding styles across the project.

## Async/Await

- Prefer `async/await` over promises for handling asynchronous operations to improve readability and error handling.

## Environmental Configuration

- Use the `ConfigModule` and `.env` files for managing environment variables and configurations.

## Import Aliases

- Set up TypeScript path aliases to avoid deeply nested imports and improve import clarity.
