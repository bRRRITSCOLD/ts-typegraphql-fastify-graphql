/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
// node_modules
import fastify from 'fastify';
const GQL = require('fastify-gql');
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';

// app
const fastifyApp = fastify({ logger: true });

const app = async () => {
  try {
    fastifyApp.register(require('fastify-cors'), {});

    const schema = await buildSchema({
      resolvers: [__dirname + `/**/*.resolver.ts`],
      container: Container,
    });

    fastifyApp.register(GQL, {
      schema,
      graphiql: true,
    });

    fastifyApp.listen(3000, (err: any, address: any) => {
      if (err) throw err;
      fastifyApp.log.info(`server listening on ${address}`);
    });
  } catch (error) {
    throw error;
  }
};

export { app };
