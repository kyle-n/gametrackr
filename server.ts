// npm
import * as express from 'express';
import {config} from 'dotenv';
import {join} from 'path';

const app = express();

app.use((req, resp) => resp.send('Hello'))
