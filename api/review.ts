import express from 'express';
import { ServerError, CreateReviewSchema } from '../schemas';
import { validate } from 'jsonschema';
import { client } from '../db';

export const router: express.Router = express.Router();

const defaultError: ServerError = { status: 500, msg: 'Internal server error' };

const createReview = async (req: express.Request, resp: express.Response): Promise<void | express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, CreateReviewSchema).valid) {
      error = { status: 400, msg: 'Must provide a valid game ID and star rating' };
      throw new Error();
    }
    await client.none('INSERT INTO reviews (game_id, user_id, stars) VALUES ($1, $2, $3);', [req.body.game_id, resp.locals.id, req.body.stars]);
    return resp.status(200).send();
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
}
