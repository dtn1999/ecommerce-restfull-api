import Hapi from '@hapi/hapi';
import { usersContoller } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const usersPlugin:Hapi.Plugin<undefined> = {
  name: 'app/users',
  dependencies: ['app/prisma'],
  register: (server:Hapi.Server) => {
    server.route([
      // Post: create user route
      {
        method: 'POST',
        path: '/users',
        options: {
          auth: {
            mode: 'optional',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: usersContoller.createUserHandler,
      },
      // Get: get user by id route
      {
        method: 'GET',
        path: '/users/{userId}',
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: usersContoller.getUserByIdHandler,
      },
      // Get: get all users route
      {
        method: 'GET',
        path: '/users',
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: usersContoller.getUserAllHandler,
      },
      // Put: update existing user by id

      // Delete: delete existing user by id route
      {
        method: 'DELETE',
        path: '/users/{userId}',
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: usersContoller.deleteUserByIdHandler,
      },

    ]);
  },
};

export default usersPlugin;
