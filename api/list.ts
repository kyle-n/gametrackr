import express from 'express';
import { ListUpdateSchema, ServerError }from '../schemas'
import { validate } from 'jsonschema';
import { client } from '../db';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' }

const createList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  if (!validate(req.body, ListUpdateSchema)) return resp.status(400).send('Must provide a valid title and deck');
  client.query('INSERT INTO list_metadata(title, deck, user_id) VALUES ($1, $2, $3) RETURNING id;', [req.body.title, req.body.deck, resp.locals.id]).then(rows => {
    return resp.status(200).json({ listId: rows[0].id });
  }).catch(() => resp.status(error.status).send(error.msg));
  return;
}

const readList = (req: express.Request, resp: express.Response): void | express.Response => {
  return;
}

const readAllLists = (req: express.Request, resp: express.Response): void | express.Response => {
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
