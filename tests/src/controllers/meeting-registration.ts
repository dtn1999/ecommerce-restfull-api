/* eslint-disable no-shadow */
import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import { MeetingParamSchema } from '../validations';

export default {
  registerToMeetingHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials.activeUser.id;
    const { params } = request;
    const { error, errors } = MeetingParamSchema.validate(params);
    if (errors || error) {
      return Boom.badRequest('Make sured you passed the meeting id of the meeting you want to attent');
    }
    console.log(userId);
    const meetingId = parseInt(params.meetingId, 10);
    try {
      const createdRegistration = await prisma.meetingRegistration.create({
        data: {
          Meeting: {
            connect: { id: meetingId },
          },
          user: {
            connect: { id: userId },
          },
        },
        include: {
          Meeting: {
            select: {
              theme: true,
              title: true,
              User: {
                select: {
                  email: true,
                  social: true,
                },
              },
              MeetingCredential: {
                select: {
                  meetingEntryId: true,
                  meetingPwd: true,
                  MeetingRoom: {
                    select: {
                      open: true,
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return h.response({
        registration: createdRegistration,
      })
        .code(201);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation('An error occured on the server while trying to registerd , it can happened when you pass the id of a meeting that dosne exist:   ', error.message);
    }
  },
  unRegisterToMeetingHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const userId = request.auth.credentials.activeUser.id;
    const { params } = request;
    const { error, errors } = MeetingParamSchema.validate(params);
    if (errors || error) {
      return Boom.badRequest('Make sured you passed the meeting id of the meeting you want to attent');
    }

    const meetingId = parseInt(params.meetingId, 10);
    try {
      const deletedRegistration = await prisma.meetingRegistration.delete({
        where: {
          userId_meetingId: {
            userId,
            meetingId,
          },
        },
      });

      if (!deletedRegistration) {
        return Boom.notFound('It seems like there is no registration with the requested id');
      }
      return h.response().code(204);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation('An error occured on the server while trying to registerd , it can happened when you pass the id of a meeting that dosne exist:   ', error.message);
    }
  },
};
