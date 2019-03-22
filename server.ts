// npm
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import express from 'express';
import bodyParser from 'body-parser';

// app init
export const app: express.Application = express();
app.use(bodyParser.json({ limit: '50mb' }));
import { Initializer } from './db';
Initializer();

// cors
app.use((req, resp, next) => {
  resp.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  resp.header('Access-Control-Allow-Credentials', 'true');
  resp.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  resp.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,OPTIONS');
  next();
});

// api
import apiRoutes from './api';
app.use('/api', apiRoutes);

// run server
app.listen(process.env.PORT || 8000, () => console.log('Server running at selected port...'));