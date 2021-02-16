import dotenv from 'dotenv';
import { startServer, createServer } from './server';

dotenv.config();
createServer().then(startServer)
  .catch((error) => {
    console.error(error);
  });
