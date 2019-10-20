// npm
import dotenv from 'dotenv';
import express from 'express';
import {join} from 'path';
import {json} from 'body-parser';

// submodules
import apiRouters from './api';
import {sequelize} from './models';

(async () => {

  // hidden vars
  dotenv.config();

  // init db
  await sequelize.authenticate();
  await sequelize.sync();
  console.log('Connected to Postgres');

  // app config
  const app: express.Application = express();
  app.use(json());
  app.use('/api', apiRouters);

  // test process
  app.use((req, resp) => resp.send('Hello'));

  // listen
  const port = process.env.PORT || 8000;
  app.listen(port, () => console.log(`Listening at port ${port}...`));

})();
