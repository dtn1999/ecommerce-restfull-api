import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { meetingsController } from '../controllers';
import { API_AUTH_STRATEGEY } from '../models/auth';
import { MeetingParamSchema } from '../validations';

const meetingsPlugin:Hapi.Plugin<undefined> = {
  name: 'app/meetings',
  dependencies: ['app/prisma'],
  register: async (server:Hapi.Server) => {
    /** create routes for meeting endpoints */
    server.route([
      /** create a meeting */
      {
        method: 'POST',
        path: '/meetings',
        options: {
          auth: {
            mode: 'optional',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: meetingsController.createMeetingHandler,
      },
      /** delete meeting */
      {
        method: 'DELETE',
        path: '/meetings/{meetingId}',
        options: {
          auth: {
            mode: 'optional',
            strategy: API_AUTH_STRATEGEY,
          },
          pre: [isHostOfTheMeeting],
        },
        handler: meetingsController.deleteMeetingHandler,
      },
      /** get meeting my id */
      {
        method: 'GET',
        path: '/meetings/{meetingId}',
        options: {
          auth: {
            mode: 'optional',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: meetingsController.getMeetingByIdHandler,
      },

      /** get all meeting  */
      {
        method: 'GET',
        path: '/meetings',
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: meetingsController.getAllMeetingsHandler,
      },
      /** update meeting */
      {
        method: 'PUT',
        path: '/meetings/{meetingId}',
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STRATEGEY,
          },
        },
        handler: meetingsController.updateMeetingByIdHandler,
      },
    ]);
  },
};

async function isHostOfTheMeeting(request:Hapi.Request, h:Hapi.ResponseToolkit) {
  const { prisma } = request.server.app;
  const payload = request.params as {meetingId: string};
  const { error, errors } = MeetingParamSchema.validate(payload);
  if (error || errors) {
    return Boom.badRequest('Make sure you request contain the meentigId you want to update or delete');
  }

  const meetingId = parseInt(payload.meetingId, 10);
  const hostId = request.auth.credentials.activeUser.id;
  // get

  try {
    const fetchedMeeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });
    if (fetchedMeeting?.hostId === hostId) {
      return h.continue;
    }
    return Boom.forbidden('you are not the owner of the meeting you want to delete');
  // eslint-disable-next-line no-shadow
  } catch (error) {
    console.error(error);
    return Boom.badRequest('Make sure the meeting you want to delete exist');
  }
}
export default meetingsPlugin;
