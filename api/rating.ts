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

router.post('/', async (req, resp) => {
  const ratingProps: RatingProps = {
    gameId: req.body.gameId,
    userId: 1,
    rating: req.body.rating
  };
  const newRating: Rating = await Rating.create(ratingProps);

  return resp.json(newRating);
});

router.get('/:id', async (req, resp) => {
  const foundRating: Rating | null = await Rating.findOne({where: {id: req.params.id}});
  if (!foundRating) return resp.status(404).send();

  return resp.json(foundRating);
});

router.patch('/:id', async (req, resp) => {
  const update = {rating: req.body.rating};
  const updatedRatings: Rating[] = (await Rating.update(update, {where: {id: req.params.id}, returning: true}))[1];

  if (!updatedRatings.length) return resp.status(404).send();
  if (updatedRatings.length > 1) return resp.status(500).send();

  return resp.json(updatedRatings[0]);
});

router.delete('/:id', async (req, resp) => {
  const ratingToDelete: Rating | null = await Rating.findOne({where: {id: req.params.id}});
  if (!ratingToDelete) return resp.status(404).send();

  await ratingToDelete.destroy();
  return resp.status(200).send();
});
