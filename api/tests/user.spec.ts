import { app } from '../../server';
import { createUser, readUser, updateUser, deleteUser } from '../user';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Client } from 'pg';
import sinon from 'sinon';
import { User } from '../../schemas';
import { connectionUrl } from '../../db';

// config
chai.use(chaiHttp);
const should = chai.should();
const client: Client = new Client(connectionUrl);
client.connect();

describe('CRUD API for user profile data', () => {

  beforeEach(() => {
    return new Promise(resolve => {
      client.query('DELETE FROM users WHERE id < 0;')
      .then(() => resolve());
    });
  });

});