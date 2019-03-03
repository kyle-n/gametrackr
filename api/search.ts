import express from 'express';
import axios from 'axios';

export const router: express.Router = express.Router();

router.get('/', (req, resp) => {
  if (!req.query) return resp.json({ results: [] });
  let error = { status: 500, msg: 'Database error' };
  const queryString: string = '?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    'format=json',
    `query=${req.query.searchTerm}`
  ].join('&');
  axios.get(`https://www.giantbomb.com/api/search/${queryString}`).then(resp => {
    if (!resp) {
      error = { status: 404, msg: 'No results from Giant Bomb' };
      throw new Error();
    }
    console.log(resp);
  }).catch(e => resp.status(error.status).send(error.msg));
});