/* eslint-disable no-shadow */
import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import generator from 'generate-password';
import { generateEmailToken } from '../auth';
import { TMeeting } from '../models';
import { TUpdateMeeting } from '../models/meeting';
import {
  createMeetingPayloadSchema,
  MeetingParamSchema,
  UpdateMeetingPayloadSchema,
} from '../validations';

export default {
  createMeetingHandler: async (request:Hapi.Request, h:Hapi.ResponseToolkit) => {
    const { prisma } = request.server.app;
    const payload = request.payload as TMeeting;
    const hostId = request.auth.credentials.activeUser.id;
    const { errors, error } = createMeetingPayloadSchema.validate(payload);

    if (error || errors) {
      return Boom.badRequest('The given payload is not valis');
    }

    try {
      const meetingEntryId = generateEmailToken();
      const meetingPwd = generator.generate({
        length: 10,
        numbers: true,
      });
      const createdMeeting = await prisma.meeting.create({
        data: {
          ...payload,
          User: {
            connect: { id: hostId },
          },
          // create meeting credantials and meeting room
          MeetingCredential: {
            create: {
              meetingEntryId,
              meetingPwd,
              MeetingRoom: {
                create: {
                  open: false,
                  User: {
                    connect: { id: hostId },
                  },
                },
              },
            },
          },
        },
        // include additional information in the response field
        include: {
          MeetingCredential: {
            select: {
              meetingEntryId: true,
              meetingPwd: true,
              MeetingRoom: {
                select: {
                  id: true,
                  open: true,
                  User: {
                    select: {
                      email: true,
                      social: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return h.response({ meetingRoomInfo: createdMeeting }).code(201);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation('error occured con the server');
    }
  },
  /** delete a meeting */
  deleteMeetingHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    const { params } = request;
    const { error, errors } = MeetingParamSchema.validate(params);

    if (error || errors) {
      return Boom.badRequest('Make sure the parameter your past with your request are correct');
    }

    try {
      const meetingId = parseInt(params.meetingId, 10);
      await prisma.meeting.delete({
        where: { id: meetingId },
      });
      return h.response().code(204);
    } catch (error) {
      console.error(error);
      return Boom.notFound('There is no meeting with the given id');
    }
  },

  /** get a meeting by id */
  getMeetingByIdHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    const { params } = request;
    const { error, errors } = MeetingParamSchema.validate(params);

    if (error || errors) {
      return Boom.badRequest('Make sure the parameter your past with your request are correct');
    }

    try {
      const meetingId = parseInt(params.meetingId, 10);
      const fetchedMeeting = await prisma.meeting.findUnique({
        where: { id: meetingId },
      });
      return h.response({ meeting: fetchedMeeting }).code(200);
    } catch (error) {
      console.error(error);
      return Boom.notFound('There is no meeting with the given id');
    }
  },

  /** get all meetings */
  getAllMeetingsHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    try {
      const fetchedMeetings = await prisma.meeting.findMany({});
      return h.response({ meetings: fetchedMeetings }).code(200);
    } catch (error) {
      console.error(error);
      return Boom.badImplementation('error occured while trying to fetch all meetings');
    }
  },
  /** zpdate meeting */
  updateMeetingByIdHandler: async (
    request:Hapi.Request,
    h:Hapi.ResponseToolkit,
  ) => {
    const { prisma } = request.server.app;
    const { params } = request;
    const payload = request.payload as TUpdateMeeting;
    const {
      error: paramError,
      errors: paramsErrors,
    } = MeetingParamSchema.validate(params);

    const {
      error: payloadError,
      errors: payloadErrors,
    } = UpdateMeetingPayloadSchema.validate(payload);

    if (paramError || paramsErrors || payloadError || payloadErrors) {
      console.log(payloadError, payloadErrors, paramError, paramsErrors);
      return Boom.badRequest('Make sure the parameter your past with your request are correct');
    }

    try {
      const meetingId = parseInt(params.meetingId, 10);

      const { title, theme, meetingDetails } = payload;
      const updatedMeeting = await prisma.meeting.update({
        where: { id: meetingId },
        data: {
          title,
          theme,
          meetingDetails,
        },
      });
      console.log(updatedMeeting);
      return h.response({ meeting: updatedMeeting }).code(200);
    } catch (error) {
      console.error(error);
      return Boom.notFound('There is no meeting with the given id');
    }
  },
};
