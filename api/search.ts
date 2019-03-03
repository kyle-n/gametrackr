import express from 'express';
import axios from 'axios';

const router: express.Router = express.Router();

router.get('/', (req, resp) => {
  if (!req.query) return resp.json({ results: [] });
  let error = { status: 500, msg: 'Database error' };
  const queryString: string = '?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    'format=json',
    `query=${req.query.searchTerm}`,
    'field_list=name,id,platforms'
  ].join('&');
  axios.get(`https://www.giantbomb.com/api/search/${queryString}`).then(resp => {
    if (!resp) {
      error = { status: 404, msg: 'No results from Giant Bomb' };
      throw new Error();
    }
    console.log(resp.data.results[4].platforms);
  }).catch(e => resp.status(error.status).send(error.msg));
});

export = router;