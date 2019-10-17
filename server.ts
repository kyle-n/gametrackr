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

// init db
initializeDatabase().subscribe(
  () => console.log('Connected to Postgres'),
  () => console.log('Could not connect to Postgres')
);

// test process
app.use((req, resp) => resp.send('Hello'));
app.listen(process.env.PORT || 8000, () => console.log(`Listening at port ${process.env.PORT || 8000}...`));
