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

const readAllReviews = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const rows: any[] = await client.query('SELECT id, game_id, stars FROM reviews WHERE user_id = $1;', resp.locals.id);
    return resp.status(200).json({ reviews: rows });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
}

const readReview = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if ()
  }
}
