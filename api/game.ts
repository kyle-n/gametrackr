import express from 'express';

import {validateRequest} from '../utils';
import {GbConnector} from '../external-connectors';

import {Game, GameProps} from '../models';

import * as postPatchSchema from './schemas/game/post-patch.json';

const validPostOrPatch = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, postPatchSchema);

const buildGameUpsert = (body: any): GameProps => {
  return {
    custom: true,
    apiDetailUrl: '',
    deck: body.deck,
    description: body.description,
    developers: body.developers ? body.developers.split(',') : '',
    expectedReleaseDay: body.expectedReleaseDay,
    expectedReleaseMonth: body.expectedReleaseMonth,
    expectedReleaseYear: body.expectedReleaseYear,
    franchises: body.franchises ? body.franchises.split(',') : '',
    genres: body.genres ? body.genres.split(',') : '',
    gbId: null,
    image: body.image,
    name: body.name,
    platforms: [],
    releases: body.releases ? body.releases.split(',') : '',
    siteDetailUrl: null
  };
}

const router: express.Router = express.Router();

router.get('/search', async (req, resp) => {
  try {
    return resp.json(await GbConnector.search(req.query.q));
  } catch (e) {
    return resp.status(500).send(e);
  }
});

router.post('/', validPostOrPatch, async (req, resp) => {
  return resp.json(await Game.create(buildGameUpsert(req.body)));
});

router.get('/:id', async (req, resp) => {
  const foundGame: Game | null = await Game.findOne({where: {id: req.params.id}});
  if (!foundGame) return resp.status(404).send();

  return resp.json(foundGame);
});

router.patch('/:id', validPostOrPatch, async (req, resp) => {
  const updatedGames: Game[] = (await Game.update(buildGameUpsert(req.body), {where: {id: req.params.id}, returning: true}))[1];
  if (!updatedGames.length) return resp.status(404).send();
  if (updatedGames.length > 1) return resp.status(500).send();

  return resp.json(updatedGames[0]);
});

router.delete('/:id', async (req, resp) => {
  const gameToDelete: Game | null = await Game.findOne({where: {id: req.params.id}});
  if (!gameToDelete) return resp.status(404).send();

  await gameToDelete.destroy();
  return resp.status(200).send();
});

export default router;
