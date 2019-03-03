import discover from './discover';
import list from './list';
import review from './review';
import search from './search';
import user from './user';

// check JWT middleware

import express from 'express';
export const router: express.Router = express.Router();

router.use('/discover', discover);
router.use('/list', list);
router.use('/review', review);
router.use('/search', search);
router.use('/user', user);
