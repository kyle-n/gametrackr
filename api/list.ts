// npm
import express from 'express';

// helpers
import {validateRequest, getPublicListData} from '../utils';

// schemas
import * as postSchema from './schemas/list/post.json';
import * as patchSchema from './schemas/list/patch.json';

// models
import {List, User} from '../models';

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

router.post('/', validPost, async (req, resp) => {
  const newList: List = await List.create({
    title: req.body.title,
    deck: req.body.deck
  });
  
  return resp.json(getPublicListData(newList));
});
