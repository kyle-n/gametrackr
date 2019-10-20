// npm
import express from 'express';
import {validateRequest, getPublicUserData} from '../utils';
import {Op} from 'sequelize';
import {hash} from 'bcrypt';

// schemas
import * as postSchema from './schemas/user/post.json';
import * as patchSchema from './schemas/user/patch.json';

// models
import {User} from '../models';

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

  return resp.json(getPublicUserData(newUser));
});

router.get('/:id', async (req, resp) => {
  const foundUser: User | null = await User.findOne({where: {id: req.params.id}});
  if (!foundUser) return resp.status(404).send();
  
  // return email as well if user is requesting their own data

  return resp.json(getPublicUserData(foundUser));
});

router.patch('/:id', validPatch, async (req, resp) => {

  // build update object
  const update: {name?: string, password?: string, email?: string, confirmed?: boolean} = {};
  if (req.body.name) update.name = req.body.name;
  if (req.body.password) {
    const encryptedPw: string = await hash(req.body.password, 10);
    update.password = encryptedPw;
  }
  if (req.body.email) {
    update.email = req.body.email;
    update.confirmed = false;
  }

  const updatedUsers: User[] = (await User.update(update, {where: {id: req.params.id}, returning: true}))[1];
  if (!updatedUsers.length) return resp.status(404).send();
  if (updatedUsers.length > 1) return resp.status(500).send();

  return resp.json(getPublicUserData(updatedUsers[0]));
});

router.delete('/:id', async (req, resp) => {

  // check permissions
  const userToDelete: User | null = await User.findOne({where: {id: req.params.id}});
  if (!userToDelete) return resp.status(404).send();

  await userToDelete.destroy();
  return resp.status(200).send();
});

export default router;
