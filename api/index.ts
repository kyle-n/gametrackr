import express from 'express';
import userRouter from './user';

const apiRouters: express.Router = express.Router();

apiRouters.use('/users', userRouter);

export default apiRouters;
