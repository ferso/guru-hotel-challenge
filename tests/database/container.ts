import { Connection, createConnection } from "typeorm";
import { config } from "tests/config";
export const mongoServerDbMocks = async () => {
  config();
  let client: Connection = await createConnection();

  return client;
};
