import environment from "./loadEnvironment.js";
import debugConfig from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import app from "./server/app.js";
import connectDb from "./database/connectDb.js";
import { MongoServerError } from "mongodb";

const { port, mongoDbUri } = environment;
const debug = debugConfig("feisbuk:root");

try {
  await startServer(app, port);
  debug(chalk.green(`Server is running on http://localhost:${port}`));

  await connectDb(mongoDbUri);
  debug(chalk.green("Successfully connected to the database"));
} catch (error: unknown) {
  if (error instanceof MongoServerError) {
    debug(
      chalk.red(`Error connecting to the database ${(error as Error).message}`)
    );
  } else {
    debug(
      chalk.red(
        `There was an error starting the server: ${(error as Error).message}`
      )
    );
  }
}
