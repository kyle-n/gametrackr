import { GiantBombGame, CustomGameSchema, CustomGame, ServerError, GiantBombPlatform, CustomGameUpdateSchema } from '../schemas';
import express from 'express';
import { validate } from 'jsonschema';
import { client } from '../db';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

export const createGame = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  let gameId: number;
  if (!validate(req.body, CustomGameSchema).valid) return resp.status(400).send('Must provide a valid name, description, release date and image with at least one list selected');
  client.query('SELECT user_id FROM list_metadata WHERE id IN ($1:csv);', [req.body.lists]).then(rows => {
    const listsBelongToUser: boolean = rows.reduce((allOwned: boolean, r: any) => {
      return allOwned && r.user_id === resp.locals.id;
    }, true);
    if (!listsBelongToUser) {
      error = { status: 403, msg: 'Cannot add a custom game to another user\'s list' };
      throw new Error();
    }
    return client.query('SELECT id FROM games WHERE id > $1 ORDER BY id DESC LIMIT 1;', parseInt(<string>process.env.CUSTOM_GAME_ID_FLOOR));
  }).then(rows => {
    if (rows.length) gameId = rows[0].length;
    else gameId = parseInt(<string>process.env.CUSTOM_GAME_ID_FLOOR) + 1;
    return client.query('INSERT INTO games(name, deck, original_release_date, image, owner_id, id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;', [req.body.name, req.body.deck, req.body.original_release_date, req.body.image, resp.locals.id, gameId]);
  }).then(rows => {
    gameId = rows[0].id;
    return client.query('SELECT MAX(ranking), list_id FROM list_entries WHERE list_id IN ($1:csv) GROUP BY list_id;', [req.body.lists]);
  }).then(rows => {
    return client.tx(t => {
      const queries = req.body.lists.map((listId: number) => {
        let r = rows.find((row: any) => row.id === listId);
        if (!r) r = { ranking: 0, list_id: listId };
        return t.query('INSERT INTO list_entries (ranking, list_id, game_id, user_id) VALUES ($1, $2, $3, $4);', [r.ranking + 1, r.list_id, gameId, resp.locals.id]);
      });
      return t.batch(queries);
    });
  }).then(() => {
    return resp.status(200).send();
  }).catch(e => {
    if (error.status === 500) console.log(e); 
    resp.status(error.status).send(error.msg);
  });
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
  let error: ServerError = { ...defaultError };
  if (!validate(req.body, CustomGameUpdateSchema).valid) return resp.status(400).send('Must provide a valid new name, description, release date or image');
  client.query('SELECT owner_id FROM games WHERE id = $1;', req.params.gameId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a game with the requested ID' };
      throw new Error();
    }
    if (!rows[0].owner_id) {
      error = { status: 403, msg: 'Cannot update non-custom Giant Bomb games' };
      throw new Error();
    }
    if (rows[0].owner_id !== resp.locals.id) {
      error = { status: 403, msg: 'Cannot update another user\'s custom game' };
      throw new Error();
    }
    return client.tx(t => {
      const queries = [];
      const update: any = {};
      if (req.body.name) update.name = req.body.name;
      if (req.body.deck) update.deck = req.body.deck;
      if (req.body.original_release_date) update.original_release_date = req.body.original_release_date;
      if (req.body.image) update.image = req.body.image;
      for (const field in update) {
        queries.push(t.query('UPDATE games SET $1~ = $2 WHERE id = $3;', [field, update[field], req.params.gameId]));
      }
      return t.batch(queries);
    });
  }).then(() => resp.status(200).send())
  .catch(() => resp.status(error.status).send(error.msg));
}

export const deleteGame = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  client.query('SELECT owner_id FROM games WHERE id = $1;', req.params.gameId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a game with the requested ID' };
      throw new Error();
    }
    if (!rows[0].owner_id) {
      error = { status: 403, msg: 'Cannot delete non-custom Giant Bomb games' };
      throw new Error();
    }
    if (rows[0].owner_id !== resp.locals.id) {
      error = { status: 403, msg: 'Cannot delete another user\'s custom game' };
      throw new Error();
    }
    return client.query('DELETE FROM games WHERE id = $1 AND owner_id = $2;', [req.params.gameId, resp.locals.id]);
  }).then(() => {
    return client.query('DELETE FROM list_entries WHERE game_id = $1 AND user_id = $2;', [req.params.gameId, resp.locals.id]);
  }).then(() => resp.status(200).send())
  .catch(() => resp.status(error.status).send(error.msg));
}

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/games/game_id, not /api/games');

router.route('/').get(fourHundredNotSpecified)
                 .post(createGame)
                 .patch(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified)
router.route('/:gameId').post(fourHundredNotSpecified)
                        .get(readGame)
                        .patch(updateGame)
                        .delete(deleteGame);
