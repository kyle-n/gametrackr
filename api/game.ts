import { GiantBombGame, CustomGameSchema, CustomGame, ServerError } from '../schemas';
import express from 'express';
import { validate } from 'jsonschema';
import { client } from '../db';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const createGame = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  let gameId: number;
  if (!validate(req.body, CustomGameSchema).valid) return resp.status(400).send('Must provide a valid name, description, release date and image');
  client.query('SELECT user_id FROM list_metadata WHERE id IN ($1:csv);', [req.body.lists]).then(rows => {
    const listsBelongToUser: boolean = rows.reduce((allOwned: boolean, r: any) => {
      return allOwned && r.user_id === resp.locals.id;
    }, true);
    if (!listsBelongToUser) {
      error = { status: 403, msg: 'Cannot add a custom game to another user\'s list' };
      throw new Error();
    }
    return client.query('INSERT INTO games(name, deck, original_release_date, image, custom) VALUES ($1, $2, $3, $4, true) RETURNING id;', [req.body.name, req.body.deck, req.body.original_release_date, req.body.image]);
  }).then(rows => {
    gameId = rows[0].id;
    return client.query('SELECT MAX(ranking), list_id FROM list_entries WHERE list_id IN ($1:csv) GROUP BY list_id;', [req.body.lists]);
  }).then(rows => {
    return client.tx(t => {
      const queries = rows.map((r: any) => {
        return t.query('INSERT INTO list_entries (ranking, list_id, game_id) VALUES ($1, $2, $3);', [r.ranking + 1, r.list_id, gameId]);
      });
      return t.batch(queries);
    });
  }).then(rows => {
    return resp.status(200).send();
  });
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
