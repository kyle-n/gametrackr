import express from 'express';
import axios from 'axios';
import { SearchResultSchema, GiantBombGame, GiantBombPlatform } from '../schemas';
import { validate } from 'jsonschema';
import { Client } from 'pg';
import { connectionUrl } from '../db';
import { objectEmpty } from '../utils';

const router: express.Router = express.Router();
const client: Client = new Client(connectionUrl);
client.connect();

router.get('/', (req, resp) => {

  // handle user request
  let error = { status: 500, msg: 'Database error' };
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
    if (!gbResp || !gbResp.data || !validate(gbResp.data, SearchResultSchema)) {
      error = { status: 500, msg: 'Could not load results from Giant Bomb' };
      throw new Error();
    }

    // immediately pass data to client for speedy showing results on frontend
    resp.json(gbResp.data);

    // save games to db while client works
    // Max 10 results at a time from API so individual inserts are okay
    for (let i = 0; i < gbResp.data.results.length; i++) {
      const g: GiantBombGame = gbResp.data.results[i];
      const platformIds: number[] = g.platforms.map(p => p.id);
      // insert game, which may have new data
      client.query('DELETE FROM ONLY games WHERE id = $1', [g.id]).then(() => {
        client.query(`INSERT INTO games(aliases, api_detail_url, deck, description, expected_release_day, 
          expected_release_month, expected_release_year, guid, id, name, original_release_date, 
          site_detail_url, resource_type, platforms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`,
          [g.aliases, g.api_detail_url, g.deck, g.description, g.expected_release_day, g.expected_release_month, g.expected_release_year, g.guid, g.id, g.name, g.original_release_date, g.site_detail_url, g.resource_type, platformIds]
        );
      });
    }

    // save platform data
    const allPlatforms: GiantBombPlatform[] = gbResp.data.results.reduce((arr: GiantBombPlatform[], g: GiantBombGame) => {
      return arr.concat(g.platforms);
    }, []);
    const previousIds: number[] = [];
    // insert platform, which may have new data
    for (let j = 0; j < allPlatforms.length; j++) {
      const p: GiantBombPlatform = allPlatforms[j];
      if (previousIds.includes(p.id)) continue;
      previousIds.push(p.id);
      client.query('DELETE FROM ONLY platforms WHERE id = $1', [p.id]).then(() => {
        client.query('INSERT INTO platforms(id, api_detail_url, name, site_detail_url, abbreviation) VALUES ($1, $2, $3, $4, $5);', [p.id, p.api_detail_url, p.name, p.site_detail_url, p.abbreviation]);
      });
    }
    return 0;
  }).catch(e => { console.log(e); resp.status(error.status).send(error.msg) });
});

export = router;
