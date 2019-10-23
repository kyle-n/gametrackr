import express from 'express';

import {validateRequest} from '../utils';

import {List, Entry} from '../models';

import * as postSchema from './schemas/entry/post.json';
import * as patchSchema from './schemas/entry/patch.json';

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
  const newEntry: Entry = await Entry.create({
    text: req.body.text,
    gameId: req.body.gameId,
    listId: req.body.listId
  });

  return resp.json(newEntry.getPublicData());
});

router.get('/:id', async (req, resp) => {
  const foundEntry: Entry | null = await Entry.findOne({where: {id: req.params.id}});
  if (!foundEntry) return resp.status(404).send();

  return resp.json(foundEntry.getPublicData());
});

router.patch('/:id', validPatch, async (req, resp) => {
  const update: {
    text?: string;
    gameId?: number;
  } = {};
  if (req.body.text) update.text = req.body.text;
  if (req.body.gameId) update.gameId = req.body.gameId;

  const updatedEntries: Array<Entry> = (await Entry.update(update, {where: {id: req.params.id}}))[1];
  if (!updatedEntries.length) return resp.status(404).send();
  if (updatedEntries.length > 1) return resp.status(500).send();

  return resp.json(updatedEntries[0].getPublicData());
});

router.delete('/:id', async (req, resp) => {
  // check permissions
  const entryToDelete: Entry | null = await Entry.findOne({where: {id: req.params.id}});
  if (!entryToDelete) return resp.status(404).send();

  return resp.status(200).send();
});

export default router;
