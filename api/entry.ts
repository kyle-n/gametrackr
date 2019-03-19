import express from 'express';
import { ListEntry, ServerError, CreateEntrySchema } from '../schemas';
import { client } from '../db';
import { validate } from 'jsonschema';

const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

const createEntry = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, CreateEntrySchema).valid) {
      error = { status: 400, msg: 'Must provide a valid game ID, entry text and list ID' };
      throw new Error();
    }

    const userList: any[] = await client.query('SELECT id FROM list_metadata WHERE user_id = $1 AND id = $2;', [resp.locals.id, req.params.listId]);
    if (!userList.length) {
      error = { status: 403, msg: 'Cannot add an entry to another user\'s list' };
      throw new Error();
    }

    let newRanking: number;
    if (req.body.ranking) newRanking = req.body.ranking;
    else {
      const rows: any[] = await client.query('SELECT ranking FROM list_entries WHERE user_id = $1 AND list_id = $2 ORDER BY ranking DESC LIMIT 1;', [resp.locals.id, req.params.listId]);
      if (rows.length) newRanking = rows[0] + 1;
      else newRanking = 1;
    }

    const insertedEntry: ListEntry = <ListEntry>(await client.one('INSERT INTO list_entries (game_id, list_id, ranking, text) VALUES ($1, $2, $3, $4) RETURNING id, game_id, list_id, ranking, text;', [req.body.game_id, req.body.list_id, newRanking, req.body.text]))
    return resp.status(200).json(insertedEntry);
  } catch (e) {
    resp.status(error.status).send(error.msg);
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
    resp.status(error.status).send(error.msg);
  }
};

const readAllEntries = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const entries: ListEntry[] = await client.query('SELECT * FROM list_entries WHERE list_id = $1 AND user_id = $2;', [req.params.listId, resp.locals.id]);
    return resp.status(200).json({ entries });
  } catch (e) {
    resp.status(error.status).send(error.msg);
  }
};

const updateEntry = (req: express.Request, resp: express.Response): Promise<express.Response> => {

};

const deleteAllEntries = (req: express.Request, resp: express.Response): Promise<express.Response> => {

};

const deleteEntry = (req: express.Request, resp: express.Response): Promise<express.Response> => {

};
