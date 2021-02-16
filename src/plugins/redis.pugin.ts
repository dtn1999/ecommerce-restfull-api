/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import Hapi from '@hapi/hapi';
import * as redis from 'redis';

import { promisify } from 'util';

declare module '@hapi/hapi'{
    interface ServerApplicationState{
        redis: redis.RedisClient
    }
}

const prismaPlugin:Hapi.Plugin<undefined> = {
  name: 'app/prisma',
  register: async (server:Hapi.Server) => {
    const client = redis.createClient({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    server.app.redis = client;

    server.ext({
      type: 'onPostStop',
      method: async (serverReq:Hapi.Server) => {
        console.log(serverReq.app.redis.quit());
      },
    });
  },
};

export default prismaPlugin;
