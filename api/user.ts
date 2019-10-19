// npm
import express from 'express';
import {Schema} from 'jsonschema';
import {validateRequest} from '../utils';

// schemas
import * as postSchema from './schemas/user/post.json';
import * as patchSchema from './schemas/user/patch.json';

// init validators
const validPost = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, postSchema);

const validPatch = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, patchSchema);

const router: express.Router = express.Router();

router.post('/', validPost, (req, resp) => {
  return resp.send('POSTed');
});

export default router;
