import express from 'express';

import {validateRequest} from '../utils';
import {GbConnector} from '../external-connectors';

import {Game} from '../models';

const router: express.Router = express.Router();

router.get('/search', async (req, resp) => {
  try {
    return resp.json(await GbConnector.search(req.query.q));
  } catch (e) {
    return resp.status(500).send(e);
  }
});

export default router;
