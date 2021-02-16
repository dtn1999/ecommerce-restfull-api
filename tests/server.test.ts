/* eslint-disable no-undef */
import Hapi from '@hapi/hapi';
import { createServer } from '../src/server';

describe('Test if server starting', () => {
  let server:Hapi.Server;

  beforeAll(async () => {
    server = await createServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('createServer: Should return instance of server', async () => {
    expect(server).toBeTruthy();
  });
});
