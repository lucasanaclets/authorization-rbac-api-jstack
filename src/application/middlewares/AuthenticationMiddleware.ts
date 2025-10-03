import { verify } from "jsonwebtoken";
import {
  IData,
  IMiddleware,
  IRequest,
  IResponse,
} from "../interfaces/IMiddleware";
import { env } from "../config/env";

export class AuthenticationMiddleware implements IMiddleware {
  async handle(request: IRequest): Promise<IResponse | IData> {
    const { authorization } = request.headers;

    if (!authorization) {
      return {
        statusCode: 401,
        body: {
          error: "Invalid access token",
        },
      };
    }

    try {
      const [bearer, token] = authorization.split(" ");

      if (bearer !== "Bearer") {
        throw new Error();
      }

      const payload = verify(token!, env.jwtSecret);

      return {
        data: {
          accountId: payload.sub,
        },
      };
    } catch {
      return {
        statusCode: 401,
        body: {
          error: "Invalid access token",
        },
      };
    }
  }
}
