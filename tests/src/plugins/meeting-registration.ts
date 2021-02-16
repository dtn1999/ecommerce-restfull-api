import Hapi from '@hapi/hapi';
import { meetingRegistrationController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';

const meetingRegistrationPlugin:Hapi.Plugin<undefined> = {
  name: 'app/meeting-registration',
  dependencies: ['app/prisma'],
  register: (server:Hapi.Server) => {
    /** define end points */
    server.route([
      /** register for a meeting */
      {
        method: 'POST',
        path: '/meeting-registation/{meetingId}',
        options: {
          auth: {
            strategy: API_AUTH_STRATEGEY,
            mode: 'required',
          },
        },
        handler: meetingRegistrationController.registerToMeetingHandler,
      },

      /** unregister for a meeting */
      {
        method: 'DELETE',
        path: '/meeting-registation/{meetingId}',
        options: {
          auth: {
            strategy: API_AUTH_STRATEGEY,
            mode: 'required',
          },
        },
        handler: meetingRegistrationController.unRegisterToMeetingHandler,
      },
    ]);
  },
};

export default meetingRegistrationPlugin;
