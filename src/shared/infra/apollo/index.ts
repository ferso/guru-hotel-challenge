import { ApolloError, ApolloServer, gql } from "apollo-server";
import { Logger } from "../logger/logger";
import { buildSchema } from "type-graphql";
import { PingResolver } from "../graphql/resolver/ping.resolver";
import { HotelResolver } from "src/hotel-prices/infra/graphql/resolvers/hotel.resolver";
import { ErrorBase } from "src/shared/exceptions/error-base.exception";
import { UserResolver } from "../graphql/resolver/user.resolver";
import { authChecker } from "../graphql/middleware/authorization-checker.middleware";

export class ApolloServerAdapter {
  logger: Logger;
  server: ApolloServer;

  constructor() {
    this.logger = new Logger();
    return this;
  }
  async setSetServer() {
    this.server = new ApolloServer({
      introspection: true,
      debug: false,
      schema: await buildSchema({
        resolvers: [PingResolver, HotelResolver, UserResolver],
      }),
      context: ({ req, res }) => ({ req, res }),
      formatError(error) {
        if (error.originalError instanceof ErrorBase) {
          return new ApolloError(
            error.message,
            error.extensions.exception.name
          );
        }
        return error;
      },
    });

    return this;
  }

  async start(next?: Function) {
    await this.setSetServer();
    return new Promise(async (resolve, reject) => {
      this.server?.listen({ port: process.env.APP_PORT }).then(({ url }) => {
        this.logger.logger.info(
          "APOLLO SERVER STARTED ",
          `🚀  Server ready at ${url}`
        );
        return resolve(this.server);
      });
    });
  }
}
