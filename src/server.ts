import Hapi from '@hapi/hapi';
import hapiAuthJWTPlugin from 'hapi-auth-jwt2';
import InertPlugin from '@hapi/inert';
import * as fs from 'fs';
import {
  apiStatusPlugin,
  prismaPlugin,
  authPlugin,
  emailPlugin,
  shopPlugin,
  productPlugin,
  categoryPlugin,
} from './plugins';
import orderPlugin from './plugins/order.plugin';

export const UPLOAD_PATH = './uploads';
export async function createServer():Promise<Hapi.Server> {
  if (!fs.existsSync(UPLOAD_PATH)) {
    console.log('does not exist');
    fs.mkdirSync(UPLOAD_PATH);
  }
  console.log('Server is Starting ... HOST', process.env.HOST);
  const server:Hapi.Server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || process.env.DEV_HOST,
    routes: {
      cors: {
        origin: 'ignore',
        // headers: ['Authorization'], // an array of strings - 'Access-Control-Allow-Headers'
        // eslint-disable-next-line max-len
        // exposedHeaders: ['Accept'], // an array of exposed headers - 'Access-Control-Expose-Headers',
        // additionalExposedHeaders: ['Accept'], // an array of additional exposed headers
        // credentials: true, // boolean - 'Access-Control-Allow-Credentials'
      },
    },
  });

  await server.register([
    InertPlugin,
    hapiAuthJWTPlugin,
    authPlugin,
    emailPlugin,
    apiStatusPlugin,
    prismaPlugin,
    shopPlugin,
    productPlugin,
    categoryPlugin,
    orderPlugin,
  ], {
    routes: {
      prefix: '/api',
    },
  });

  // serve upload folder  // static folder (serving)
  server.route({
    method: 'GET',
    path: '/uploads/{file*}',
    handler: {
      directory: {
        path: 'uploads',
        listing: true,
      },
    },
    options: {
      auth: {
        mode: 'optional',
      },
    },
  });

  await server.initialize();
  return server;
}
export async function startServer(server:Hapi.Server):Promise<Hapi.Server> {
  await server.start();
  console.log(`🚀 server has started on location : ${server.info.uri}`);
  return server;
}

process.on('unhandledRejection', (error) => {
  console.error('Server has failled to start ', error);
  process.exit(1);
});
