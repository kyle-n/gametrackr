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
    chai.request(app).post('/api/users').send({ username, password }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide an email address');
      resp.error.status.should.equal(400);
      return chai.request(app).post('/api/users').send({ password, email });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide a username');
      resp.error.status.should.equal(400);
      return chai.request(app).post('/api/users').send({ username, email });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide a password');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 400 for a password that breaks requirements', done => {
    chai.request(app).post('/api/users').send({ username, password: '12345', email }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
      resp.error.status.should.equal(400);
      return chai.request(app).post('/api/users').send({ username, password: 'abcdefgh', email });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 400 for an email that breaks requirements', done => {
    chai.request(app).post('/api/users').send({ username, password, email: 'nomail' }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide a valid email address');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('successfully adds new user', done => {
    let profile: User;
    chai.request(app).post('/api/users').send({ username, password, email }).then(resp => {
      resp.status.should.equal(200);
      setTimeout(() => {
        client.query('SELECT * FROM users WHERE name = $1;', [username]).then(data => {
          profile = data.rows[0];
          expect(data.rowCount).to.equal(1);
          expect(profile.password).to.not.equal(password);
          expect(profile.email).to.equal(email);
          expect(profile.list_index_id).to.not.equal(null);
          expect(profile.confirmed).to.equal(false);
          //return client.query('SELECT ')
        });
      }, 1000);
    });
  }).timeout(3000);

});
