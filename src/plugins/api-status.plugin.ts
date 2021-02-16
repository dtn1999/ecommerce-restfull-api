import Hapi from '@hapi/hapi';
import * as redis from 'redis';

import { promisify } from 'util';

const apiStatusPlugin:Hapi.Plugin<undefined> = {
  name: 'app/status',
  version: '1.0.0',
  register: async (server:Hapi.Server) => {
    // create a route to check if the server is actually running
    server.route([
      {
        method: 'GET',
        path: '/status',
        options: {
          auth: false,
        },
        handler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
          const { prisma } = request.server.app;
          try {
            await prisma.$connect();
            return h.response({ up: true, data: 'Hello' }).code(200);
          } catch (error) {
            console.log('cannot connetct to the data base', error);
            return h.response({ error }).code(500);
          }
        },
      },
      {
        method: 'GET',
        path: '/status-redis',
        options: {
          auth: false,
        },
        handler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
          const client = redis.createClient({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT),
          });

          const setAsync = promisify(client.set).bind(client);
          const getAsync = promisify(client.get).bind(client);
          try {
            await setAsync('foo', 'bar');
            const fooValue = await getAsync('foo');
            return h.response({ fooValue }).code(200);
          } catch (error) {
            console.log(error);
            return h.response({ error }).code(500);
          }
        },
      },
    ]);
  },
  once: true,
};

export default apiStatusPlugin;
