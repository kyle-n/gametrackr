import express from 'express';
import userRouter from './user';
import listRouter from './list';
import entryRouter from './entry';

const apiRouters: express.Router = express.Router();

apiRouters.use('/users', userRouter);
apiRouters.use('/lists', listRouter);
apiRouters.use('/entries', entryRouter);

export default apiRouters;
