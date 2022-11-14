import dotenv from "dotenv";

dotenv.config();

interface Environment {
  port: number;
  debug: string;
  mongoDebug: boolean;
  mongoDbUri: string;
  saltLength: number;
  jwtSecret: string;
  supabaseBucket: string;
  supabaseKey: string;
  supabaseUrl: string;
}

const {
  PORT: port,
  DEBUG: debug,
  MONGO_DEBUG: mongoDebug,
  MONGO_DB_URI: mongoDbUri,
  SALT_LENGTH: saltLength,
  JWT_SECRET: jwtSecret,
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  SUPABASE_BUCKET: supabaseBucket,
} = process.env;

const environment: Environment = {
  port: +port,
  debug,
  mongoDebug: mongoDebug === "true",
  mongoDbUri,
  saltLength: +saltLength,
  jwtSecret,
  supabaseBucket,
  supabaseKey,
  supabaseUrl,
};

export default environment;
