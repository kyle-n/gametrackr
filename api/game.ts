import { GiantBombGame, CustomGameSchema, CustomGame, ServerError, GiantBombPlatform } from '../schemas';
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
  }).catch(() => resp.status(error.status).send(error.msg));
}

export const readGame = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  client.query('SELECT games.*, platforms.id as platform_id, platforms.name as platform_name, platforms.site_detail_url as platform_detail_url FROM games JOIN platforms ON platforms.id = ANY(games.platforms::int[]) WHERE games.id = $1;', req.params.gameId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a game with the requested ID' };
      throw new Error();
    }
    const platforms: GiantBombPlatform[] = rows.map((r: any) => {
      return <GiantBombPlatform>{
        id: r.platform_id,
        name: r.platform_name,
        site_detail_url: r.platform_detail_url,
        abbreviation: r.abbreviation
      };
    });
    const gameToReturn: GiantBombGame = <GiantBombGame>{
      aliases: rows[0].aliases,
      api_detail_url: rows[0].api_detail_url,
      deck: rows[0].deck,
      description: rows[0].description,
      expected_release_day: rows[0].expected_release_day,
      expected_release_month: rows[0].expected_release_month,
      expected_release_year: rows[0].expected_release_year,
      guid: rows[0].guid,
      id: rows[0].id,
      name: rows[0].name,
      image: rows[0].image,
      original_release_date: rows[0].original_release_date,
      site_detail_url: rows[0].site_detail_url,
      resource_type: rows[0].resource_type,
      platforms,
      owner_id: rows[0].owner_id
    };
    return resp.status(200).json(gameToReturn);
  }).catch(() => resp.status(error.status).send(error.msg));
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
