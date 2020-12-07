// node_modules
import 'reflect-metadata';
import open from 'open';
const onExit = require('signal-exit');

// libraries
import { env } from './lib/environment';
import { logger } from './lib/logger';
import { anyUtils } from './lib/utils';

// models
import { APIError } from './models/error';

// app
import { bootstrap } from './app';

// certralize app exiting
function exit(code?: number | string | boolean | any) {
  // build exit code
  const exitCode = code || 1;
  // log for debugging and POTENTIAL run purposes
  if (exitCode === 0) logger.info(`{}App::#exit::code=${anyUtils.stringify(exitCode)}`);
  else logger.error(`{}App::#exit::code=${anyUtils.stringify(exitCode)}`);
  // exit process after timeout to let streams clear
  setTimeout(() => {
    process.exit(exitCode);
  }, 1500);
}

// catch all possible exits in app
onExit((code: unknown, signal: unknown) => {
  // log for debugging and run support purposes
  logger.info(`{}App::#onExit::code=${anyUtils.stringify(code)}::signal=${anyUtils.stringify(signal)}`);
  // return explicitly
  return;
});

process.on('uncaughtException', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  logger.error(`{}App::uncaughtException::error=${anyUtils.stringify(error)}`);
  // exit explicitly
  exit(1);
});

process.on('unhandledRejection', (err: unknown) => {
  // build error
  const error = new APIError(err);
  // log for debugging and run support purposes
  logger.error(`{}App::unhandledRejection::error=${anyUtils.stringify(error)}`);
  // exit explicitly
  exit(1);
});

// execute file
(async () => {
  try {
    // load env
    await env.init({ ...require('./configs/environment').default });
    // initialize asynchronous libraries, connectiones, etc. here
    await Promise.all([]);
    // initialize synchronous libraries, connectiones, etc. here
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    [];
    // build app
    const app = await bootstrap();
    // start server
    const serverInfo = await app.listen(env.PORT);
    // log for debugging and run support purposes
    logger.info(`{}App::server started::serverInfo=${anyUtils.stringify(serverInfo)}`);
    if (env.isLocal) logger.info(`{}App::graphiql running::url=${anyUtils.stringify(`${serverInfo}/graphiql`)}`);
    // open chrome to graphiql for dev
    if (env.isLocal) await open(`${serverInfo}/graphiql`, { app: 'google chrome' });
  } catch (err) {
    // build error
    const error = new APIError(err);
    // log for debugging and run support purposes
    logger.error(`{}App::error executing::error=${anyUtils.stringify(error)}`);
    // exit explicitly
    exit(1);
  }
})();
