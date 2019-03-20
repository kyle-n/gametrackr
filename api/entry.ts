import express from 'express';
import { ListEntry, ServerError, CreateEntrySchema, UpdateEntrySchema, UpdateEntriesOrderSchema } from '../schemas';
import { client } from '../db';
import { validate } from 'jsonschema';

const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

const createEntry = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, CreateEntrySchema).valid) {
      error = { status: 400, msg: 'Must provide a valid game ID and entry text' };
      throw new Error();
    }

    const userList: any[] = await client.query('SELECT id FROM list_metadata WHERE user_id = $1 AND id = $2;', [resp.locals.id, req.params.listId]);
    if (!userList.length) {
      error = { status: 404, msg: 'Could not find a list with the requested ID' };
      throw new Error();
    }

    let newRanking: number;
    if (req.body.ranking) newRanking = req.body.ranking;
    else {
      const rows: any[] = await client.query('SELECT ranking FROM list_entries WHERE user_id = $1 AND list_id = $2 ORDER BY ranking DESC LIMIT 1;', [resp.locals.id, req.params.listId]);
      if (rows.length) newRanking = rows[0].ranking + 1;
      else newRanking = 1;
    }

    const insertedEntry: ListEntry = <ListEntry>(await client.one('INSERT INTO list_entries (game_id, list_id, ranking, text, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *;', [req.body.game_id, req.params.listId, newRanking, req.body.text, resp.locals.id]))
    return resp.status(200).json(insertedEntry);
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const readEntry = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const rows: ListEntry[] = await client.query('SELECT * FROM list_entries WHERE list_id = $1 AND id = $2 AND user_id = $3;', [req.params.listId, req.params.entryId, resp.locals.id]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find an entry with the requested ID' };
      throw new Error();
    }
    return resp.status(200).json(rows[0]);
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const readAllEntries = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const entries: ListEntry[] = await client.query('SELECT * FROM list_entries WHERE list_id = $1 AND user_id = $2 ORDER BY ranking ASC;', [req.params.listId, resp.locals.id]);
    return resp.status(200).json({ entries });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const updateEntry = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, UpdateEntrySchema).valid) {
      error = { status: 400, msg: 'Must provide valid new entry text' }
      throw new Error();
    }
    const rows: ListEntry[] = await client.query('UPDATE list_entries SET text = $1 WHERE list_id = $2 AND user_id = $3 RETURNING *;', [req.body.text, req.params.listId, resp.locals.id]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find an entry with the requested ID' };
      throw new Error();
    }
    return resp.status(200).json(rows[0]);
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const updateAllEntries = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, UpdateEntriesOrderSchema).valid) {
      error = { status: 400, msg: 'Must provide a list of objects with entry IDs and rankings' };
      throw new Error();
    }
    const rows: any[] = await client.query('SELECT id FROM list_entries WHERE list_id = $1 AND user_id = $2;', [req.params.listId, resp.locals.id]);
    if (rows.length !== req.body.entries.length) {
      error = { status: 400, msg: `You provided ${req.body.entries.length} list entries but the database has ${rows.length}` };
      throw new Error();
    }
    await client.tx(t => {
      const queries = req.body.entries.map((entry: any) => {
        return client.none('UPDATE list_entries SET ranking = $1 WHERE id = $2 AND user_id = $3;', [entry.ranking, entry.id, resp.locals.id]);
      });
      return t.batch(queries);
    });
    const updatedEntries: ListEntry[] = await client.query('SELECT * FROM list_entries WHERE list_id = $1 AND user_id = $2 ORDER BY ranking ASC;', [req.params.listId, resp.locals.id]);
    return resp.status(200).json({ entries: updatedEntries });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const deleteAllEntries = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    await client.query('DELETE FROM list_entries WHERE list_id = $1 AND user_id = $2;', [req.params.listId, resp.locals.id]);
    return resp.status(200).send();
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const deleteEntry = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const rows: any[] = await client.query('DELETE FROM list_entries WHERE list_id = $1 AND id = $2 AND user_id = $3 RETURNING ranking;', [req.params.listId, req.params.entryId, resp.locals.id]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find an entry with the requested ID' };
      throw new Error();
    }
    await client.query('UPDATE list_entries SET ranking = ranking - 1 WHERE list_id = $1 AND user_id = $2 AND ranking > $3;', [req.params.listId, resp.locals.id, rows[0].ranking]);
    const updatedEntries: ListEntry[] = await client.query('SELECT * FROM list_entries WHERE list_id = $1 AND user_id = $2;', [req.params.listId, resp.locals.id]);
    return resp.status(200).json({ entries: updatedEntries });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/lists/list_id/entries/entry_id, not /api/lists/list_id/entries');

export const router: express.Router = express.Router({ mergeParams: true });
router.route('/').get(readAllEntries)
                 .post(createEntry)
                 .patch(updateAllEntries)
                 .delete(deleteAllEntries)
router.route('/:entryId').get(readEntry)
                         .patch(updateEntry)
                         .delete(deleteEntry);
