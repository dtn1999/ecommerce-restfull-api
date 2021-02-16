/* eslint-disable no-undef */
import Hapi from '@hapi/hapi';
import { createServer } from '../src/server';

describe('Status plugin', () => {
  // eslint-disable-next-line no-unused-vars
  let server:Hapi.Server;
  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    server.stop();
  });

  test('Test if server is running: route exist', async () => {
    const getResponse = await server.inject({
      method: 'GET',
      url: '/api/status',
    });
    // response should return goo status code
    expect(getResponse.statusCode).toEqual(200);
    const getResponseJson = JSON.parse(getResponse.payload);
    expect(getResponseJson.up).toEqual(true);
  });

  test('Test if server is running: method doesn\'t exist', async () => {
    const postResponse = await server.inject({
      method: 'POST',
      url: '/api/status',
    });
    // response should return goo status code
    expect(postResponse.statusCode).toEqual(404);
    const postResponseJson = JSON.parse(postResponse.payload);
    expect(postResponseJson.up).toEqual(undefined);
    expect(postResponseJson.error).toBeTruthy();
  });
});
