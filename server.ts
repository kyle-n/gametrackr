// npm
import * as express from 'express';
import {config} from 'dotenv';
import {join} from 'path';
import {json} from 'body-parser';

// app config
const app = express();
app.use(json());

app.use((req, resp) => resp.send('Hello'));

app.listen(process.env.PORT || 8000, () => console.log(`Listening at port ${process.env.PORT || 8000}...`));
