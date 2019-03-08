import discover from './discover';
import review from './review';
import { router as search } from './search';
import { router as user } from './user';
import { router as external } from './external';
import { router as list } from './list';
import { checkJwt } from './checkjwt';

// check JWT middleware

import express from 'express';
const router: express.Router = express.Router();

router.use('/discover', discover);
router.use('/lists', checkJwt, list);
router.use('/reviews', checkJwt, review);
router.use('/search', checkJwt, search);
router.use('/users', checkJwt, user);
router.use('/external', external);

export = router;
