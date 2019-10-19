// npm
import dotenv from 'dotenv';
import express from 'express';
import {join} from 'path';
import {json} from 'body-parser';

// submodules
import {initializeDatabase} from './db';

// hidden vars
dotenv.config();

// app config
const app: express.Application = express();
app.use(json());

// start up server
startup();

// test process
app.use((req, resp) => resp.send('Hello'));

async function startup() {
  await initializeDatabase();
  console.log('Connected to Postgres');
}

// listen
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening at port ${port}...`));
