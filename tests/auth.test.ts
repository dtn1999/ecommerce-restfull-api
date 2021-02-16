/* eslint-disable no-undef */
import Hapi from '@hapi/hapi';
import { createServer } from '../src/server';

describe('/api/login - create user', () => {
  // eslint-disable-next-line no-unused-vars
  let server:Hapi.Server;

  const badRequest = {
    email: 'danyls',
  };

  const goodRequest = {
    email: 'danyls@gmail.com',
  };

  let emailToken:string;

  let accessToken:string;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    // await server.app.prisma.token.deleteMany({});
    // await server.app.prisma.meeting.deleteMany({});
    // await server.app.prisma.user.deleteMany({});
    await server.stop();
  });

  test('try to login with bad login payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        ...badRequest,
      },
    });
    expect(response.statusCode).toBe(400);
  });

  test('try to login with good login payload', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/login',
      payload: {
        ...goodRequest,
      },
    });
    expect(response.statusCode).toBe(200);
    const responsePayload = JSON.parse(response.payload);
    emailToken = responsePayload.token.emailToken;
    expect(responsePayload.token.valid).toBe(true);
  });

  test('try to authenticate with bad token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/authenticate',
      payload: {
        email: goodRequest.email,
        emailToken: '28',
      },
    });
    expect(response.statusCode).toBe(401);
    const responsePayload = JSON.parse(response.payload);
    expect(responsePayload.token).toBeFalsy();
  });

  test('try to authenticate with good token', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/api/authenticate',
      payload: {
        email: goodRequest.email,
        emailToken,
      },
    });
    expect(response.statusCode).toBe(200);
    const responsePayload = JSON.parse(response.payload);
    accessToken = responsePayload.accessToken;
    expect(accessToken).toBeTruthy();
  });

  test('try to get all meetings bad token', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/meetings',
      headers: {
        Authorization: 'dasdasdasdas',
      },
    });
    expect(response.statusCode).toBe(401);
  });
});
