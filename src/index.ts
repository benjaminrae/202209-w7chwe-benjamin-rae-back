import environment from "./loadEnvironment.js";
import debugConfig from "debug";
import chalk from "chalk";
import startServer from "./server/startServer.js";
import app from "./server/app.js";

const { port } = environment;
const debug = debugConfig("feisbuk:root");

try {
  await startServer(app, port);
  debug(chalk.green(`Server is running on http://localhost:${port}`));
} catch (error: unknown) {
  debug(
    chalk.red(
      `There was an error starting the server: ${(error as Error).message}`
    )
  );
}
