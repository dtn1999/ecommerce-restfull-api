/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import Hapi from '@hapi/hapi';
import { PrismaClient } from '@prisma/client';

declare module '@hapi/hapi'{
    interface ServerApplicationState{
        prisma: PrismaClient
    }
}

const prismaPlugin:Hapi.Plugin<undefined> = {
  name: 'app/prisma',
  register: async (server:Hapi.Server) => {
    const prisma = new PrismaClient();

    server.app.prisma = prisma;

    server.ext({
      type: 'onPostStop',
      method: async (serverReq:Hapi.Server) => {
        await serverReq.app.prisma.$disconnect();
      },
    });
  },
};

export default prismaPlugin;
