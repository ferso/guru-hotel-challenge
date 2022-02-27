import { Logger } from "../logger/logger";
import { buildSchema } from "type-graphql";
import { ApolloError, ApolloServer } from "apollo-server";
import { PingResolver } from "../graphql/resolver/ping.resolver";
import { HotelResolver } from "src/hotel-prices/infra/graphql/resolvers/hotel.resolver";
import { ErrorBase } from "src/shared/exceptions/error-base.exception";
import { UserResolver } from "../graphql/resolver/user.resolver";
import { Container } from "typedi";
import { CustomAuthChecker } from "./middleware/authorization.middleware";
import { ApolloServerPluginCacheControl } from "apollo-server-core";

const { BaseRedisCache } = require("apollo-server-cache-redis");
import Redis from "ioredis";
import { GetHotelMetricsService } from "src/hotel-prices/application/services/get-hotel-metrics.service";
export class ApolloServerAdapter {
  logger: Logger;
  server: ApolloServer;

  constructor() {
    this.logger = new Logger();
    return this;
  }
  async setSetServer() {
    this.server = new ApolloServer({
      debug: false,
      introspection: true,
      // plugins: [
      //   ApolloServerPluginCacheControl({
      //     defaultMaxAge: 30,
      //   }),
      // ],

      cache: new BaseRedisCache({
        plugins: [ApolloServerPluginCacheControl()],
        client: new Redis({
          host: "localhost",
        }),
      }),
      schema: await buildSchema({
        emitSchemaFile: true,
        resolvers: [PingResolver, HotelResolver, UserResolver],
        container: Container,
        authChecker: CustomAuthChecker,
      }),
      context: ({ req, res }) => ({ req, res }),
      formatError(error) {
        if (error.originalError instanceof ErrorBase) {
          return new ApolloError(error.message, error.originalError.name);
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
