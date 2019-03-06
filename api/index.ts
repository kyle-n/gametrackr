import discover from './discover';
import list from './list';
import review from './review';
import { router as search } from './search';
import { router as user } from './user';

// check JWT middleware

import express from 'express';
const router: express.Router = express.Router();

router.use('/discover', discover);
router.use('/lists', list);
router.use('/reviews', review);
router.use('/search', search);
router.use('/users', user);

export = router;
