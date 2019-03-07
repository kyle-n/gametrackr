import { app } from '../../server';
import { createUser, readUser, updateUser, deleteUser } from '../user';
import { describe, it, beforeEach } from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import { Client } from 'pg';
import sinon from 'sinon';
import { User, List, ListEntry } from '../../schemas';
import { connectionUrl } from '../../db';

// config
chai.use(chaiHttp);
const should = chai.should();
const client: Client = new Client(connectionUrl);
client.connect();
const password = 'xyz123', email='kylebnazario@yahoo.com';

describe('CRUD API for user profile data', () => {

  // let system init db
  before(done => setTimeout(done, 500));

  after(() => client.end());

  afterEach(() => {
    /*
    return new Promise((resolve, reject) => {
      client.query('DELETE FROM users WHERE id < 0;')
      .then(() => resolve()).catch(() => reject());
    });
    */
  });

  // create
  it('returns 400 for requests missing a required field', done => {
    chai.request(app).post('/api/users').send({ password }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide an email address');
      resp.error.status.should.equal(400);
      return chai.request(app).post('/api/users').send({ email });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide a password');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 400 for a password that breaks requirements', done => {
    chai.request(app).post('/api/users').send({ password: '12345', email }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
      resp.error.status.should.equal(400);
      return chai.request(app).post('/api/users').send({ password: 'abcdefgh', email });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 400 for an email that breaks requirements', done => {
    chai.request(app).post('/api/users').send({ password, email: 'nomail' }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide a valid email address');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 409 for taken email', done => {
    chai.request(app).post('/api/users').send({ password, email }).then(() => {
      setTimeout(() => {
        chai.request(app).post('/api/users').send({ password, email }).then(resp => {
          resp.error.text.should.be.a('string');
          resp.error.text.should.equal('Email address is already taken');
          resp.error.status.should.equal(409);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  it('correctly adds user data', done => {
    chai.request(app).post('/api/users').send({ password, email }).then(resp => {
      resp.status.should.equal(200);
      setTimeout(() => {
        client.query('SELECT * FROM users WHERE email = $1;', [email]).then(data => {
          const profile = data.rows[0];
          expect(data.rowCount).to.equal(1);
          expect(profile.password).to.not.equal(password);
          expect(profile.email).to.equal(email);
          expect(profile.confirmed).to.equal(false);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  it('creates default user list', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(resp => {
      resp.status.should.equal(200);
      setTimeout(() => {
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          return client.query('SELECT * FROM list_metadata WHERE user_id = $1;', [data.rows[0].id]);
        }).then(data => {
          expect(data.rowCount).to.equal(1);
          const playedGamesList = data.rows[0];
          expect(playedGamesList.id).to.not.equal(null);
          expect(playedGamesList.list_table_name).to.be.a('string');
          expect(playedGamesList.title.toLowerCase()).to.equal('played games');
          expect(playedGamesList.deck).to.equal(null);
          return client.query('SELECT * FROM $1;', [playedGamesList.list_table_name]);
        }).then(data => {
          expect(data.rowCount).to.equal(0);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  // read
  it('returns 400 for requests without an id', done => {
    chai.request(app).get('/api/users').then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Request /api/users/user_id, not /api/users');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 404 for users not in db', done => {
    client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(data => {
      let missingId: number;
      if (data.rowCount > 0) missingId = data.rows[0].id + 1;
      else missingId = 1;
      return chai.request(app).get(`/api/users/${missingId}`);
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('User profile with that ID not found');
      resp.error.status.should.equal(404);
      return done();
    });
  });

  it('returns correct user data', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        let uId: number;
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          uId = data.rows[0].id;
          return chai.request(app).get(`/api/users/${uId}`);
        }).then(resp => {
          expect(resp.body.id).to.equal(uId);
          expect(resp.body.email).to.equal(email);
          expect(resp.body.confirmed).to.equal(false);
          expect(resp.body.password).to.equal(undefined);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

});
