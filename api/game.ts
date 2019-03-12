import { GiantBombGame } from '../schemas';
import express from 'express';

export const router: express.Router = express.Router();

export const createGame = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

export const readGame = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

export const updateGame = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

export const deleteGame = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/games/game_id, not /api/games');

router.route('/').get(fourHundredNotSpecified)
                 .post(fourHundredNotSpecified)
                 .put(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified)
router.route('/:gameId').post(createGame)
                        .get(readGame)
                        .put(updateGame)
                        .delete(deleteGame);
