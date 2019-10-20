// npm
import express from 'express';

// helpers
import {validateRequest} from '../utils';

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
  
  return resp.json(newList.getPublicData());
});

router.get('/:id', async (req, resp) => {
  const foundList: List | null = await List.findOne({where: {id: req.params.id}});
  if (!foundList) return resp.status(404).send();

  return resp.json(foundList.getPublicData());
});

router.patch('/:id', async (req, resp) => {
  // build update object
  const updatedLists: Array<List> = (await List.update(req.body, {where: {id: req.params.id}, returning: true}))[1];
  if (!updatedLists.length) return resp.status(404).send();

  return resp.json(updatedLists[0].getPublicData());
});

router.delete('/:id', async (req, resp) => {
  // check permissions
  const listToDelete: List | null = await List.findOne({where: {id: req.params.id}});
  if (!listToDelete) return resp.status(404).send();

  await listToDelete.destroy();
  return resp.status(200).send();
});
