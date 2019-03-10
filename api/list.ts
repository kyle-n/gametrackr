import express from 'express';
import { ListUpdateSchema, ServerError }from '../schemas'
import { validate } from 'jsonschema';
import { client } from '../db';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' }

const createList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  if (!validate(req.body, ListUpdateSchema)) return resp.status(400).send('Must provide a valid title and deck');
  client.query('INSERT INTO list_metadata(title, deck, user_id, private) VALUES ($1, $2, $3, $4) RETURNING id;', [req.body.title, req.body.deck, resp.locals.id, true]).then(rows => {
    return resp.status(200).json({ listId: rows[0].id });
  }).catch(() => resp.status(error.status).send(error.msg));
}

const readList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  client.query('SELECT title, deck, id, private FROM list_metadata WHERE id = $1;', req.params.listId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a list with the requested ID'};
      throw new Error();
    }
    return resp.status(200).json({ ...rows[0], entries: [] });
  }).catch(() => resp.status(error.status).send(error.msg));
}

const readAllLists = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  client.query('SELECT title, deck, id, private FROM list_metadata WHERE user_id = $1;', resp.locals.id).then(rows => {
    return resp.status(200).json({ lists: rows });
  });
  return;
}

const updateList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const deleteList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const fourHundredNotSpecified = (req: express.Request, resp: express.Response): express.Response => resp.status(400).send('Request /api/lists/list_id, not /api/lists');

router.route('/').get(readAllLists)
                 .post(createList)
                 .put(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified);
router.route('/:listId').get(readList)
                        .put(updateList)
                        .delete(deleteList);
