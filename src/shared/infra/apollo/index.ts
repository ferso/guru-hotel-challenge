import { ApolloError, ApolloServer, gql } from "apollo-server";
import { Logger } from "../logger/logger";
import { buildSchema } from "type-graphql";
import { PingResolver } from "../graphql/resolver/ping.resolver";
import { HotelResolver } from "src/hotel-prices/infra/graphql/resolvers/hotel.resolver";
import { ErrorBase } from "src/shared/exceptions/error-base.exception";
import { UserResolver } from "../graphql/resolver/user.resolver";

export class ApolloServerAdapter {
  logger: Logger;
  server: ApolloServer;

  constructor() {
    this.logger = new Logger();
    this.setSetServer();
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

    this.start();
  }

  start() {
    this.server?.listen({ port: 3000 }).then(({ url }) => {
      this.logger.logger.info(
        "APOLLO SERVER STARTED ",
        `🚀  Server ready at ${url}`
      );
    });
  }
}
