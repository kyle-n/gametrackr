// npm
import express from 'express';
import {validateRequest} from '../utils';
import {Op} from 'sequelize';
import {hash} from 'bcrypt';

// schemas
import * as postSchema from './schemas/user/post.json';
import * as patchSchema from './schemas/user/patch.json';

// models
import {User} from '../models';

// interfaces
interface UserBodyPostOrPatch {
  name?: string;
  password?: string;
  email?: string;
}

// init validators
const validPost = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, postSchema);

const validPatch = (
  req: express.Request,
  resp: express.Response,
  next: express.NextFunction,
): void => validateRequest(req, resp, next, patchSchema);

const router: express.Router = express.Router();

// create user
router.post('/', validPost, async (req, resp) => {
  const previousUserWithNameOrEmail: User | null = await User.findOne({where: {[Op.or]: [
    {name: req.body.name},
    {email: req.body.email}
  ]}});
  if (previousUserWithNameOrEmail) return resp.status(406).send();

  const encryptedPw: string = await hash(req.body.password, 10);
  const newUser: User = await User.create({
    name: req.body.name,
    password: encryptedPw,
    email: req.body.email,
    confirmed: false
  });

  const newUserStrategized = {
    name: newUser.name,
    email: newUser.email,
    id: newUser.id,
    createdAt: newUser.createdAt
  };
  return resp.json(newUserStrategized);
});

export default router;
