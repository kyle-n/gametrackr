import { describe, it, before, after, afterEach } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';j
import { Response } from 'superagent';
import { Review } from '../../schemas';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

chai.use(chaiHttp);
let token: string;
const email = 'test@test.com', password = 'abc123';
let userId: number;
let review: Review;

describe('Review API', () => {

  before(done => {
    setTimeout(async () => {
      await client.none('DELETE FROM users WHERE email = $1;', email);
      let resp: Response = await chai.request(app).post('/api/external').send({ email, password });
      if (!resp.body.token) throw new Error();
      token = 'jwt ' + resp.body.token;
      userId = (await client.one('SELECT id FROM users WHERE email = $1;', email)).id;
      resp = await chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', token);
      review = <Review>{
        game_id: resp.body.results[0].id,
        stars: 2.5
      };
      return done();
    }, 800);
  });

  afterEach(async () => {
    await client.none('DELETE FROM reviews WHERE user_id = $1;', userId);
    return;
  });

  after(async () => {
    await client.none('DELETE FROM users WHERE email = $1;', email);
    return;
  });

  // create
  it('returns 400 for POST review with a missing field', async () => {
    try {
      let resp: Response;
      const eMsg = 'Must provide a valid game ID and star rating';
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ ...review, game_id: undefined });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ ...review, stars: undefined });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 for POST new review with an invalid field', async () => {
    try {
      let resp: Response;
      const eMsg = 'Must provide a valid game ID and star rating';
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ game_id: 'x', stars: review.stars});
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ game_id: review.game_id, stars: '0' });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ game_id: review.game_id, stars: -1 });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ game_id: review.game_id, stars: 6 });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(eMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 500 for POST new review for nonexistent game', async () => {
    try {
      let resp: Response;
      const badId: number = (await client.one('SELECT id FROM games ORDER BY id DESC LIMIT 1;')).id + 1;
      resp = await chai.request(app).post('/api/reviews').set('authorization', token).send({ game_id: badId, stars: review.stars });
      expect(resp.status).to.equal(500);
      expect(resp.error.text).to.equal('Internal server error');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 500 for POST new review for nonexistent user', async () => {
    try {
      const badUserId: number = (await client.one('SELECT id FROM users ORDER BY id DESC LIMIT 1;')).id + 1;
      const badToken: string = 'jwt ' + jwt.sign({ id: badUserId, email }, <string>process.env.SECRET_KEY);
      let resp: Response = await chai.request(app).post('/api/reviews').set('authorization', badToken).send(review);
      expect(resp.status).to.equal(500);
      expect(resp.status).to.equal('Internal server error');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('saves a POST new review correctly', async () => {
    try {
      let resp: Response = await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      expect(resp.status).to.equal(200);
      const dbReview = await client.one('SELECT * FROM reviews WHERE user_id = $1;', userId);
      expect(dbReview).to.be.ok;
      expect(dbReview.id).to.be.a('number');
      expect(dbReview.id).to.be.greaterThan(0);
      expect(dbReview.game_id).to.equal(review.game_id);
      expect(dbReview.user_id).to.equal(userId);
      expect(dbReview.stars).to.equal(review.stars);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

})