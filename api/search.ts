import express from 'express';
import axios from 'axios';
import searchSchema from '../schemas/search.json';
import { validate } from 'jsonschema';
import { Client } from 'pg';
import { connectionUrl } from '../db';

const router: express.Router = express.Router();
const client: Client = new Client(connectionUrl);
client.connect();

router.get('/', (req, resp) => {
  if (!req.query) return resp.json({ results: [] });
  let error = { status: 500, msg: 'Database error' };
  const x = 'hey_ice_king';
  const queryString: string = '?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    'format=json',
    `query=${req.query.searchTerm}`,
    'field_list=name,id,platforms',
    'resources=game'
  ].join('&');
  axios.get(`https://www.giantbomb.com/api/search/${queryString}`).then(gbResp => {
    if (!gbResp || !gbResp.data || !validate(gbResp.data, searchSchema)) {
      error = { status: 500, msg: 'Could not load results from Giant Bomb' };
      throw new Error();
    }
    console.log(gbResp.data);
    resp.json(gbResp.data);
    for (let i = 0; i < gbResp.data.results.length; i++) {
      const g: any = gbResp.data.results[i];
      client.query(`INSERT INTO games(aliases, api_detail_url, deck, description, expected_release_day, 
        expected_release_month, expected_release_year, guid, id, name, original_release_date, 
        site_detail_url, resource_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`,
        [g.aliases, g.api_detail_url, g.deck, g.description, g.expected_release_day,
        g.expected_release_month, g.expected_release_year, g.guid, g.id, g.name, g.original_release_date,
        g.site_detail_url, g.resource_type])j
    }
  }).catch(e => { console.log(e); resp.status(error.status).send(error.msg) });
});

export = router;
