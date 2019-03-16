import { describe, it, before, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { Response } from 'superagent';
import { verify } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DecodedToken } from '../../schemas';
dotenv.config({ path: __dirname + '/.env' });
import { objectEmpty } from '../../utils';

chai.use(chaiHttp);
const email = 'test@test.com', password = 'abc123';

describe('External api', () => {

  before(done => {
    setTimeout(async () => {
      await client.none('DELETE FROM users WHERE email = $1;', email);
      await chai.request(app).post('/api/external').send({ email, password });
      return done();
    }, 500);
  });

  after(async () => {
    await client.none('DELETE FROM users WHERE email = $1;', email);
    return;
  });

  // login
  it('returns 400 for login POST missing a username or password', async () => {
    try {
      let resp: any;
      resp = await chai.request(app).post('/api/external/login').send({ email });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a username and password');
      resp = await chai.request(app).post('/api/external/login').send({ password });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a username and password');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 404 for POST login with missing email', async () => {
    try {
      let resp: Response;
      let badEmail: string = '';
      while (!badEmail) {
        const randEmail = Math.floor(Math.random() * 999999).toString();
        const rows = await client.query('SELECT id FROM users WHERE email = $1;', randEmail);
        if (!rows.length) badEmail = randEmail;
      }
      resp = await chai.request(app).post('/api/external/login').send({ email: badEmail, password });
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Cannot find an account for the requested email address');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 403 for POST login with wrong password', async () => {
    try {
      let resp: Response;
      const badPw = '1';
      resp = await chai.request(app).post('/api/external/login').send({ email, password: badPw });
      expect(resp.status).to.equal(403);
      expect(resp.error.text).to.equal('Incorrect password');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns a jwt on good POST login', async () => {
    try {
      let resp: Response = await chai.request(app).post('/api/external/login').send({ email, password });
      expect(resp.status).to.equal(200);
      expect(resp.body.token).to.be.a('string');
      const decoded: DecodedToken = <DecodedToken>verify(resp.body.token, <string>process.env.SECRET_KEY);
      expect(objectEmpty(decoded)).to.equal(false);
      const userDbId: number = (await client.one('SELECT id FROM users WHERE email = $1;', email)).id;
      expect(userDbId).to.equal(decoded.id);
      expect(decoded.email).to.equal(email);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

})