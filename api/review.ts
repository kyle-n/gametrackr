import express from 'express';
import { ServerError, CreateReviewSchema, UpdateReviewSchema } from '../schemas';
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
};

const readReviewSet = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const reviewIds: number[] = req.query.ids.split(',').map((id: string) => parseInt(id));
    const rows: any[] = await client.query('SELECT id, game_id, stars FROM reviews WHERE user_id = $1 AND id IN ($:csv);', [resp.locals.id, reviewIds]);
    return resp.status(200).json({ reviews: rows });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const readAllReviews = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (req.query.ids) return readReviewSet(req, resp);
    const rows: any[] = await client.query('SELECT id, game_id, stars FROM reviews WHERE user_id = $1;', resp.locals.id);
    return resp.status(200).json({ reviews: rows });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const readReview = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const rows: any[] = await client.query('SELECT id, game_id, stars FROM reviews WHERE user_id = $1 AND id = $2;', [resp.locals.id, req.params.reviewId]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a review with the requested ID' };
      throw new Error();
    }
    return resp.status(200).json({ review: rows[0] });
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const updateReview = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    if (!validate(req.body, UpdateReviewSchema).valid) {
      error = { status: 400, msg: 'Must provide a valid star rating' };
      throw new Error();
    }
    const rows: any[] = await client.query('UPDATE reviews SET stars = $1 WHERE id = $2 AND user_id = $3 RETURNING id;', [req.body.stars, req.params.reviewId, resp.locals.id]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a review with the requested ID' };
      throw new Error();
    }
    return resp.status(200).send();
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const deleteReview = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    const rows: any[] = await client.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING id;', [req.params.reviewId, resp.locals.id]);
    if (!rows.length) {
      error = { status: 404, msg: 'Could not find a review with the requested ID' };
      throw new Error();
    }
    return resp.status(200).send();
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const deleteAllReviews = async (req: express.Request, resp: express.Response): Promise<express.Response> => {
  let error: ServerError = defaultError;
  try {
    await client.none('DELETE FROM reviews WHERE user_id = $1;', resp.locals.id);
    return resp.status(200).send();
  } catch (e) {
    return resp.status(error.status).send(error.msg);
  }
};

const fourHundredNotSpecified = (req: express.Request, resp: express.Response) => resp.status(400).send('Request /api/reviews/review_id, not /api/reviews');

router.route('/').get(readAllReviews)
                 .post(createReview)
                 .put(fourHundredNotSpecified)
                 .delete(deleteAllReviews);
router.route('/:reviewId').get(readReview)
                          .put(updateReview)
                          .delete(deleteReview);
