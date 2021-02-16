import Joi from '@hapi/joi';
import { TMeeting } from '../models';

const createMeetingPayloadSchema = Joi.object<TMeeting>().keys({
  theme: Joi.string().required(),
  title: Joi.string().required(),
  meetingDetails: Joi.string().required(),
});

const UpdateMeetingPayloadSchema = Joi.object<TMeeting>().keys({
  theme: Joi.string().optional(),
  title: Joi.string().optional(),
  meetingDetails: Joi.string().optional(),
});

const MeetingParamSchema = Joi.object({
  meetingId: Joi.string().pattern(/^\d+$/),
});

export { createMeetingPayloadSchema, MeetingParamSchema, UpdateMeetingPayloadSchema };
