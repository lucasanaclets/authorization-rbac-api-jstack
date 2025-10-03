import z, { ZodError } from "zod";
import { IController, IRequest, IResponse } from "../interfaces/IController";
import { SignInUseCase } from "../useCases/SignInUseCase";
import { InvalidCredentials } from "../errors/InvalidCredentials";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class SignInController implements IController {
  constructor(private readonly signInUseCase: SignInUseCase) {}

  async handle(request: IRequest): Promise<IResponse> {
    try {
      const { email, password } = schema.parse(request.body);

      const { accessToken } = await this.signInUseCase.execute({
        email,
        password,
      });

      return { statusCode: 200, body: { accessToken } };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          statusCode: 400,
          body: error.issues,
        };
      }

      if (error instanceof InvalidCredentials) {
        return {
          statusCode: 401, // Unauthorized
          body: {
            error: "Invalid credentials",
          },
        };
      }

      throw error;
    }
  }
}
