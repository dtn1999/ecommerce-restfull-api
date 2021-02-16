import Hapi from '@hapi/hapi';

const apiStatusPlugin:Hapi.Plugin<undefined> = {
  name: 'app/status',
  version: '1.0.0',
  register: async (server:Hapi.Server) => {
    // create a route to check if the server is actually running
    server.route({
      method: 'GET',
      path: '/status',
      options: {
        auth: false,
      },
      handler: (request:Hapi.Request, h:Hapi.ResponseToolkit) => h.response({ up: true }).code(200),
    });
  },
  once: true,
};

export default apiStatusPlugin;
