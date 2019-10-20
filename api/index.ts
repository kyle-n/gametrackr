import express from 'express';
import userRouter from './user';
import listRouter from './list';

const apiRouters: express.Router = express.Router();

apiRouters.use('/users', userRouter);
apiRouters.use('/lists', listRouter);

export default apiRouters;
