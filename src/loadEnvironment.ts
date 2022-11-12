import dotenv from "dotenv";

dotenv.config();

interface Environment {
  port: number;
  debug: string;
  mongoDebug: boolean;
  mongoDbUri: string;
  saltLength: number;
  jwtSecret: string;
}

const {
  PORT: port,
  DEBUG: debug,
  MONGO_DEBUG: mongoDebug,
  MONGO_DB_URI: mongoDbUri,
  SALT_LENGTH: saltLength,
  JWT_SECRET: jwtSecret,
} = process.env;

const environment: Environment = {
  port: +port,
  debug,
  mongoDebug: mongoDebug === "true",
  mongoDbUri,
  saltLength: +saltLength,
  jwtSecret,
};

export default environment;
