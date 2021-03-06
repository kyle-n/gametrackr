import express from 'express';
import { ListUpdateSchema, ServerError }from '../schemas'
import { validate } from 'jsonschema';
import { client } from '../db';
import { router as entry } from './entry';

export const router: express.Router = express.Router();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' }

const createList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  if (!validate(req.body, ListUpdateSchema).valid) return resp.status(400).send('Must provide a valid title and deck');
  client.query('INSERT INTO list_metadata(title, deck, user_id, private) VALUES ($1, $2, $3, $4) RETURNING *;', [req.body.title, req.body.deck, resp.locals.id, true]).then(rows => {
    return resp.status(200).json(rows[0]);
  }).catch(e => { console.log(e); resp.status(error.status).send(error.msg); });
}

const readList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error: ServerError = { ...defaultError };
  client.query('SELECT title, deck, id, private, user_id FROM list_metadata WHERE id = $1;', req.params.listId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a list with the requested ID'};
      throw new Error();
    }
    if (rows[0].private && rows[0].user_id !== resp.locals.id) {
      error = { status: 403, msg: 'Cannot read another user\'s private list' };
      throw new Error();
    }
    return resp.status(200).json({ ...rows[0] });
  }).catch(() => resp.status(error.status).send(error.msg));
}

const readAllLists = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  client.query('SELECT title, deck, id, private FROM list_metadata WHERE user_id = $1;', resp.locals.id).then(rows => {
    return resp.status(200).json({ lists: rows });
  }).catch(() => resp.status(error.status).send(error.msg));
}

const updateList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  if (!validate(req.body, ListUpdateSchema).valid) return resp.status(400).send('Must provide a valid title and deck');
  client.query('SELECT user_id FROM list_metadata WHERE id = $1;', req.params.listId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Cannot find a list with the requested ID' };
      throw new Error();
    }
    if (rows[0].user_id !== resp.locals.id) {
      error = { status: 403, msg: 'Cannot update another user\'s list' };
      throw new Error();
    }
    return client.one('UPDATE list_metadata SET title = $1, deck = $2 WHERE id = $3 RETURNING *;', [req.body.title, req.body.deck, req.params.listId]);
  }).then(list => {
    return resp.status(200).json(list);
  }).catch(() => resp.status(error.status).send(error.msg));
}

const deleteList = (req: express.Request, resp: express.Response): void | express.Response => {
  let error = { ...defaultError };
  client.query('DELETE FROM list_metadata WHERE id = $1 RETURNING id;', req.params.listId).then(rows => {
    if (!rows.length) {
      error = { status: 404, msg: 'Cannot find a list with the requested ID' };
      throw new Error();
    }
    return client.query('DELETE FROM list_entries WHERE list_id = $1;', rows[0].id);
  }).then(() => {
    return resp.status(200).send();
  }).catch(() => resp.status(error.status).send(error.msg));
}

const fourHundredNotSpecified = (req: express.Request, resp: express.Response): express.Response => resp.status(400).send('Request /api/lists/list_id, not /api/lists');

router.route('/').get(readAllLists)
                 .post(createList)
                 .patch(fourHundredNotSpecified)
                 .delete(fourHundredNotSpecified);
router.route('/:listId').get(readList)
                        .patch(updateList)
                        .delete(deleteList);
router.use('/:listId/entries', entry);
