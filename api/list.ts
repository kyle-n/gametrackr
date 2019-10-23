// npm
import express from 'express';

// helpers
import {validateRequest} from '../utils';

// schemas
import * as postSchema from './schemas/list/post.json';
import * as patchSchema from './schemas/list/patch.json';
import * as putSchema from './schemas/list/put.json';

// model
import {List} from '../models';

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

const validPut = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, putSchema);

const router: express.Router = express.Router();

router.post('/', validPost, async (req, resp) => {
  const newList: List = await List.create({
    title: req.body.title,
    deck: req.body.deck,
    entryIds: []
  });
  
  return resp.json(newList.getPublicData());
});

router.get('/', async (req, resp) => {
  // limit by user
  const lists: Array<List> = await List.findAll({attributes: ['title', 'deck', 'id']});

  return resp.json({lists});
});

router.get('/:id', async (req, resp) => {
  const foundList: List | null = await List.findOne({where: {id: req.params.id}});
  if (!foundList) return resp.status(404).send();

  return resp.json(foundList.getPublicData());
});

router.patch('/:id', validPatch, async (req, resp) => {
  // build update object
  const updateData: {
    title?: string;
    deck?: string;
  } = {};
  if (req.body.title) updateData.title = req.body.title;
  if (req.body.deck) updateData.deck = req.body.deck;

  const updatedLists: Array<List> = (await List.update(updateData, {where: {id: req.params.id}, returning: true}))[1];
  if (!updatedLists.length) return resp.status(404).send();

  return resp.json(updatedLists[0].getPublicData());
});

router.put('/:id', validPut, async (req, resp) => {
  const update = {entryIds: req.body.entryIds};
  const updatedLists: List[] = (await List.update(update, {where: {id: req.params.id}}))[1];
  if (!updatedLists.length) return resp.status(404).send();
  if (updatedLists.length > 1) return resp.status(500).send();

  return resp.json(updatedLists[0].getPublicData());
});

router.delete('/:id', async (req, resp) => {
  // check permissions
  const listToDelete: List | null = await List.findOne({where: {id: req.params.id}});
  if (!listToDelete) return resp.status(404).send();

  await listToDelete.destroy();
  return resp.status(200).send();
});

export default router;
