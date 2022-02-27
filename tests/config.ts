import path from "path";
import dotenv from "dotenv";

export const config = () => {
  dotenv.config({ path: path.resolve(`./.env.${process.env.ENV}`) });
};
