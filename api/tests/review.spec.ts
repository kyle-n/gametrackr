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
let token: string, secondToken: string;
const email = 'test@test.com', password = 'abc123', secondEmail = 'test2@test.com';
let userId: number, secondUserId: number;
let review: Review;
let secondReview: Review;

describe('Review API', () => {

  before(done => {
    setTimeout(async () => {
      await client.none('DELETE FROM users WHERE email IN ($1:csv);', [[email, secondEmail]]);
      let resp: Response = await chai.request(app).post('/api/external').send({ email, password });
      if (!resp.body.token) throw new Error();
      token = 'jwt ' + resp.body.token;
      userId = (await client.one('SELECT id FROM users WHERE email = $1;', email)).id;
      resp = await chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', token);
      review = <Review>{
        game_id: resp.body.results[0].id,
        stars: 2.5
      };
      secondReview = <Review>{ game_id: resp.body.results[1].id, stars: 5 };
      resp = await chai.request(app).post('/api/external').send({ email: secondEmail, password });
      if (!resp.body.token) throw new Error();
      secondToken = 'jwt ' + resp.body.token;
      secondUserId = (await client.one('SELECT id FROM users WHERE email = $1;', secondEmail)).id;
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

  // read
  it('returns 404 for GET nonexistent review', async () => {
    try {
      const rows = await client.query('SELECT id FROM reviews ORDER BY id DESC LIMIT 1;');
      let badId: number;
      if (rows.length) badId = rows[0].id + 1;
      else badId = 1;
      const resp: Response = await chai.request(app).get(`/api/reviews/${badId}`).set('authorization', token);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a review with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('GETs all of a user\'s reviews on req /api/reviews', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      await chai.request(app).post('/api/reviews').set('authorization', token).send(secondReview);
      const resp: Response = await chai.request(app).get('/api/reviews').set('authorization', token);
      expect(resp.status).to.equal(200);
      expect(resp.body.reviews).to.be.an('array');
      expect(resp.body.reviews.length).to.equal(2);
      const returnedFirstReview = resp.body.reviews.find((r: any) => r.game_id === review.game_id);
      const returnedSecondReview = resp.body.reviews.find((r: any) => r.game_id === secondReview.game_id);
      expect(returnedFirstReview.stars).to.equal(review.stars);
      expect(returnedSecondReview.stars).to.equal(secondReview.stars);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  /*
  it('returns 500 for invalid value in GET review set query param', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      const rows = await client.query('SELECT id FROM reviews ORDER BY id DESC LIMIT 1;');
      let badId: number;
      if (rows.length) badId = rows[0].id + 1;
      else badId = 1;
      let resp: Response = await chai.request(app).get(`/api/reviews?ids=${reviewId},${badId}`)
      expect(resp.status).to.equal(500);
      expect(resp.error.text).to.equal('Internal server error');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });
  */

  it('GETs a set of reviews in query param', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      await chai.request(app).post('/api/reviews').set('authorization', token).send(secondReview);
      const reviewIds: number[] = (await client.many('SELECT id FROM reviews WHERE user_id = $1;', userId)).map((r: any) => r.id);
      const idString: string = reviewIds.join(',');
      const resp: Response = await chai.request(app).get(`/api/reviews?ids=${idString}`).set('authorization', token);
      expect(resp.status).to.equal(200);
      expect(resp.body.reviews).to.be.an('array');
      expect(resp.body.reviews.length).to.equal(2);
      const returnedFirstReview = resp.body.reviews.find((r: any) => r.game_id === review.game_id);
      const returnedSecondReview = resp.body.reviews.find((r: any) => r.game_id === secondReview.game_id);
      expect(returnedFirstReview.stars).to.equal(review.stars);
      expect(returnedSecondReview.stars).to.equal(secondReview.stars);
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('GETs a single review on request', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).get(`/api/reviews/${reviewId}`).set('authorization', token);
      expect(resp.status).to.equal(200);
      expect(resp.body.id).to.equal(reviewId);
      expect(resp.body.game_id).to.equal(review.game_id);
      expect(resp.body.stars).to.equal(review.stars);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // update
  it('returns 400 for PUT review without id', async () => {
    try {
      const resp: Response = await chai.request(app).put('/api/reviews').set('authorization', token).send(review);
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Request /api/reviews/review_id, not /api/reviews');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 404 for PUT to nonexistent review', async () => {
    try {
      let badId: number;
      const rows = await client.query('SELECT id FROM reviews ORDER BY id DESC LIMIT 1;');
      if (rows.length) badId = rows[0].id + 1;
      else badId = 1;
      const resp: Response = await chai.request(app).put(`/api/reviews/${badId}`).set('authorization', token).send(review);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a review with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 404 for PUT to other user\'s review', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', secondToken).send(review);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a review with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 for PUT that tries to change game_id', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', token).send({ game_id: -1, stars: 3 });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a valid star rating');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 for PUT review invalid/missing star rating', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', token).send({ useless: 'data' });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a valid star rating');
      resp = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', token).send({ stars: 6 });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a valid star rating');
      resp = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', token).send({ stars: -1 });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal('Must provide a valid star rating');
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('PUTs an update to a review correctly', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).put(`/api/reviews/${reviewId}`).set('authorization', token).send({ stars: 3 });
      expect(resp.status).to.equal(200);
      const dbReview: any = await client.one('SELECT * FROM reviews WHERE id = $1;', reviewId);
      expect(dbReview.game_id).to.equal(review.game_id);
      expect(dbReview.user_id).to.equal(userId);
      expect(dbReview.stars).to.equal(3);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // delete
  it('returns 404 for delete nonexistent review', async () => {
    try {
      const rows = await client.query('SELECT id FROM reviews ORDER BY id DESC LIMIT 1;');
      let badId: number;
      if (rows.length) badId = rows[0].id + 1;
      else badId = 1;
      const resp: Response = await chai.request(app).delete(`/api/reviews/${badId}`).set('authorization', token);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a review with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 404 for delete another user\'s review', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      let resp: Response = await chai.request(app).delete(`/api/reviews/${reviewId}`).set('authorization', secondToken);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a review with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  })

  it('DELETEs all of a user\'s reviews', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      await chai.request(app).post('/api/reviews').set('authorization', token).send(secondReview);
      const resp: Response = await chai.request(app).delete('/api/reviews').set('authorization', token);
      expect(resp.status).to.equal(200);
      const rows: any[] = await client.query('SELECT id FROM reviews WHERE user_id = $1;', userId);
      expect(rows.length).to.equal(0);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('DELETEs a user review', async () => {
    try {
      await chai.request(app).post('/api/reviews').set('authorization', token).send(review);
      const reviewId: number = (await client.one('SELECT id FROM reviews WHERE user_id = $1;', userId)).id;
      const resp: Response = await chai.request(app).delete(`/api/reviews/${reviewId}`).set('authorization', token);
      expect(resp.status).to.equal(200);
      const rows: any[] = await client.query('SELECT id FROM reviews WHERE user_id = $1;', userId);
      expect(rows.length).to.equal(0);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

});
