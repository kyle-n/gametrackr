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
  const previousIds: number[] = [];
  //console.log(allPlatforms);
  // insert platform, which may have new data
  for (let j = 0; j < allPlatforms.length; j++) {
    const p: GiantBombPlatform = allPlatforms[j];
    if (!p || !p.id || previousIds.includes(p.id)) continue;
    previousIds.push(p.id);
    client.query('DELETE FROM ONLY platforms WHERE id = $1', [p.id]).then(() => {
      client.query('INSERT INTO platforms(id, api_detail_url, name, site_detail_url, abbreviation) VALUES ($1, $2, $3, $4, $5);', [p.id, p.api_detail_url, p.name, p.site_detail_url, p.abbreviation]);
    });
  }
  return 0;
};

// save games to db
export const saveGames = (error: ServerError, gbResp: any): number => {
  if (!gbResp || !gbResp.data) {
    error = { status: 500, msg: 'Could not load results from Giant Bomb' };
    console.log(error);
    return 1;
  }
  // Max 10 results at a time from API so individual inserts are okay
  for (let i = 0; i < gbResp.data.results.length; i++) {
    const g: GiantBombGame = gbResp.data.results[i];
    let platformIds: number[] = [];
    if (g.platforms && Array.isArray(g.platforms)) platformIds = g.platforms.map(p => p.id);
    // insert game, which may have new data
    client.query('DELETE FROM games WHERE id = $1', [g.id]).then(() => {
      client.query(`INSERT INTO games(aliases, api_detail_url, deck, description, expected_release_day, 
        expected_release_month, expected_release_year, guid, id, name, original_release_date, 
        site_detail_url, resource_type, platforms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
        [g.aliases, g.api_detail_url, g.deck, g.description, g.expected_release_day, g.expected_release_month, g.expected_release_year, g.guid, g.id, g.name, g.original_release_date, g.site_detail_url, g.resource_type, platformIds]
      );
    });
  }
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
