import { Connection, createConnection } from "typeorm";

export const mongoServerDbMocks = async () => {
  const ormconfig = require("ormconfig");
  const config = {
    ...ormconfig,
    database: "test-api",
    dropSchema: true,
  };
  let client: Connection = await createConnection({
    ...config,
  });

  return client;
};
