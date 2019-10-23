// npm
import express from 'express';

// helpers
import {validateRequest} from '../utils';

// schemas
import * as putSchema from './schemas/rating/put.json';

// models
import {Rating, RatingProps} from '../models';

const validPut = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, putSchema);

const router: express.Router = express.Router();

router.put('/games/:id', validPut, async (req, resp) => {
  const upsertData: {
    rating: number,
    gameId: number,
    userId: number,
    id?: number
  } = {
    rating: req.body.rating,
    gameId: parseInt(req.params.id),
    userId: 1
  };
  if (req.body.id) upsertData.id = req.body.id;
  const upsertedRating: Rating = (await Rating.upsert(upsertData, {returning: true}))[0];
  
  return resp.json(upsertedRating);
});

router.get('/:id', async (req, resp) => {
  const foundRating: Rating | null = await Rating.findOne({where: {id: req.params.id}});
  if (!foundRating) return resp.status(404).send();

  return resp.json(foundRating);
});
