import express from 'express';
import axios from 'axios';
import { GiantBombGame, GiantBombPlatform, ServerError } from '../schemas';
import { client } from '../db';
import { objectEmpty } from '../utils';

export const router: express.Router = express.Router();

/* API routes broken into functions for easier testing */

// save platform data to db
export const savePlatforms = (error: ServerError, gbResp: any): number => {
  if (!gbResp || !gbResp.data) return 1;
  const allPlatforms: GiantBombPlatform[] = gbResp.data.results.reduce((arr: GiantBombPlatform[], g: GiantBombGame) => {
    return arr.concat(g.platforms);
  }, []);
  // insert platform, which may have new data
  const previousIds: number[] = [];
  const filteredPlatforms: GiantBombPlatform[] = allPlatforms.filter(p => {
    if (!p) return false;
    const alreadyUsed = previousIds.includes(p.id);
    if (!alreadyUsed) previousIds.push(p.id);
    return !alreadyUsed;
  });
  client.none('DELETE FROM platforms WHERE id IN ($1:csv);', [filteredPlatforms.map((fp: any) => fp.id)])
  .then(() => {
    return client.tx(t => {
      const queries = filteredPlatforms.map(p => {
        return t.query('INSERT INTO platforms(id, api_detail_url, name, site_detail_url, abbreviation) VALUES ($1, $2, $3, $4, $5);', [p.id, p.api_detail_url, p.name, p.site_detail_url, p.abbreviation]);
      });
      return t.batch(queries);
    });
  });
  return 0;
};

// save games to db
export const saveGames = (error: ServerError, gbResp: any): number => {
  if (!gbResp || !gbResp.data) {
    error = { status: 500, msg: 'Could not load results from Giant Bomb' };
    console.log(error);
    return 1;
  }
  client.tx(t => {
    const queries = gbResp.data.results.map((g: any) => {
      let platformIds: number[] = [];
      if (g.platforms && Array.isArray(g.platforms)) platformIds = g.platforms.map((p: any) => p.id);
      return client.query(`INSERT INTO games(aliases, api_detail_url, deck, description, expected_release_day, 
        expected_release_month, expected_release_year, guid, id, name, original_release_date, 
        site_detail_url, resource_type, platforms, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`,
        [g.aliases, g.api_detail_url, g.deck, g.description, g.expected_release_day, g.expected_release_month, g.expected_release_year, g.guid, g.id, g.name, g.original_release_date, g.site_detail_url, g.resource_type, platformIds, null]);
    });
    return t.batch(queries);
  });
  return 0;
};

export const searchGiantBomb = (req: express.Request, resp: express.Response) => {
  // handle user request
  let error: ServerError = { status: 500, msg: 'Database error' };
  if (objectEmpty(req.query)) {
    error = { status: 400, msg: 'No search query' };
    return resp.status(error.status).send(error.msg);
  }

  // call Giant Bomb API
  const queryString: string = '?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    'format=json',
    `query=${req.query.searchTerm}`,
    'resources=game'
  ].join('&');
  axios.get(`https://www.giantbomb.com/api/search/${queryString}`).then(gbResp => {
    // immediately pass data to client for speedy showing results on frontend
    //console.log(gbResp.data.results[0]);
    resp.json(gbResp.data);
    saveGames(error, gbResp);
    savePlatforms(error, gbResp);
  }).catch(e => { console.log(e); resp.status(error.status).send(error.msg) });
}

router.get('/', searchGiantBomb);
