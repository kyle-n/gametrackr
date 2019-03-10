import { app } from '../../server';
import { describe, it, beforeEach } from 'mocha';
import chai from 'chai';
import { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import { User, DecodedToken } from '../../schemas';
import { client } from '../../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });

// config
chai.use(chaiHttp);
const should = chai.should();
const password = 'xyz123', email='kylebnazario@yahoo.com';

describe('CRUD API for user profile data', () => {

  // let system init db
  before(done => setTimeout(() => {
    client.query('DELETE FROM users WHERE email = $1;', email).then(() => done());
  }, 500));

  // wipe test data
  afterEach(() => {
    return new Promise<void>((resolve, reject) => {
      client.query('DELETE FROM users WHERE email = $1 RETURNING id;', [email]).then(rows => {
        if (rows.length < 1) return new Promise<any>(resolve => resolve([]));
        else return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING id;', [rows[0].id]);
      }).then(rows => {
        if (rows.length === 0) return resolve();
        client.query('DELETE FROM list_entries WHERE list_id = ANY($1);', [rows.map((r: any) => r.id)]).then(() => resolve());
      }).catch(e => { console.log(e, 'x'); reject(); });
    });
  });

  // create
  it('returns 400 for requests missing a required field', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({}).then(resp => {
        expect(resp.status, '400 for missing email and password').to.equal(400);
        expect(resp.error.text, 'Correct error msg for missing email and password').to.equal('Must provide an email address and password');
        return chai.request(app).post('/api/external').send({ password });
      }).then(resp => {
        expect(resp.status, '400 for missing email').to.equal(400);
        expect(resp.error.text, 'Correct error msg for missing email').to.equal('Must provide an email address');
        return chai.request(app).post('/api/external').send({ email });
      }).then(resp => {
        expect(resp.status, '400 for missing password').to.equal(400);
        expect(resp.error.text, 'Correct error msg for missing password').to.equal('Must provide a password');
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    });
  });

  it('returns 400 for a password that breaks requirements', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({ password: '12345', email }).then(resp => {
        expect(resp.status, '400 for too short password').to.equal(400);
        expect(resp.error.text, 'Correct error msg for too short password').to.equal('Must provide a valid password');
        return chai.request(app).post('/api/external').send({ password: 'abcdefgh', email });
      }).then(resp => {
        expect(resp.status, '400 for password without a number').to.equal(400);
        expect(resp.error.text, 'Correct error msg for password without a number').to.equal('Must provide a valid password');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 400 for an email that breaks requirements', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({ password, email: 'nomail' }).then(resp => {
        expect(resp.status, '400 for invalid email').to.equal(400);
        expect(resp.error.text, 'Correct error msg for invalid email').to.equal('Must provide a valid email address');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 409 for taken email', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({ password, email }).then(() => {
        return chai.request(app).post('/api/external').send({ password, email });
      }).then(resp => {
        expect(resp.status, '409 for taken email').to.equal(409);
        expect(resp.error.text, 'Correct error msg for taken email').to.equal('Email address is already taken');
        return resolve();
      }).catch(() => reject());
    });
  }).timeout(3000);

  it('correctly adds user data', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({ password, email }).then(resp => {
        resp.status.should.equal(200);
        let profile: User;
        client.query('SELECT * FROM users WHERE email = $1;', [email]).then(rows => {
          expect(rows.length, 'A user record was inserted into the db').to.equal(1);
          profile = rows[0];
          return bcrypt.compare(password, profile.password);
        }).then(pwMatch => {
          expect(pwMatch, 'Hashed password matches input password').to.equal(true);
          expect(profile.email, 'Db email matches input email').to.equal(email);
          expect(profile.confirmed, 'New profiles are always not confirmed').to.equal(false);
          return resolve();
        }).catch(() => reject());
      });
    });
  });

  it('creates default user list', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/external').send({ email, password }).then(resp => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        return client.query('SELECT * FROM list_metadata WHERE user_id = $1;', [rows[0].id]);
      }).then(rows => {
        expect(rows.length, 'One default list created for new user').to.equal(1);
        const playedGamesList = rows[0];
        expect(playedGamesList.id, 'List has an id').to.be.a('number');
        expect(playedGamesList.title.toLowerCase(), 'List is named played games').to.equal('played games');
        expect(playedGamesList.deck, 'Empty string for deck').to.equal('');
        return client.query('SELECT id FROM list_entries WHERE list_id = $1;', playedGamesList.id);
      }).then(rows => {
        expect(rows.length, 'No games in new list').to.equal(0);
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns a jwt', () => {
    return new Promise<void>((resolve, reject) => {
      let decoded: DecodedToken;
      chai.request(app).post('/api/external').send({ email, password }).then(resp => {
        expect(resp.body.token, 'Returns JWT in resp.body.token').to.be.a('string');
        decoded = <DecodedToken>jwt.verify(resp.body.token, <string>process.env.SECRET_KEY);
        return client.query('SELECT id, email FROM users WHERE email = $1;', email);
      }).then(rows => {
        if (!rows.length) throw new Error();
        expect(rows[0].id, 'Db id matches jwt id').to.equal(decoded.id);
        expect(rows[0].email, 'Db email matches jwt email').to.equal(decoded.email);
        return resolve();
      }).catch(() => reject());
    });
  });

  // read
  it('returns 400 for requests without an id', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/users').then(resp => {
        expect(resp.status, '400 for GET without id').to.equal(400);
        expect(resp.error.text, 'Correct error msg for no id with GET').to.equal('Request /api/users/user_id, not /api/users');
        return resolve();
      }).catch(() => reject())
    });
  });

  it('returns 404 for users not in db', () => {
    return new Promise<void>((resolve, reject) => {
      client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(rows => {
        let missingId: number;
        if (rows.length > 0) missingId = rows[0].id + 1;
        else missingId = 1;
        return chai.request(app).get(`/api/users/${missingId}`);
      }).then(resp => {
        expect(resp.status, '404 for user not in db').to.equal(404);
        expect(resp.error.text, 'Correct error msg for requesting nonexistent user').to.equal('User profile with that ID not found');
        return resolve();
      });
    });
  });

  it('returns correct user data', () => {
    return new Promise<void>((resolve, reject) => {
      let uId: number;
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        uId = rows[0].id;
        return chai.request(app).get(`/api/users/${uId}`);
      }).then(resp => {
        expect(resp.body.id, 'Resp id matches input id').to.equal(uId);
        expect(resp.body.email, 'Resp email matches input email').to.equal(email);
        expect(resp.body.confirmed, 'New account is not confirmed').to.equal(false);
        expect(resp.body.password, 'Does not return password to user').to.equal(undefined);
        return resolve();
      }).catch(() => reject());
    });
  });

  // update
  it('returns 400 for requests without id', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).put('/api/users').send({ email, password }).then(resp => {
        expect(resp.status, '400 for request without user id').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Request /api/users/user_id, not /api/users');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 404 for nonexistant user id', () => {
    return new Promise<void>((resolve, reject) => {
      client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(rows => {
        let missingId: number;
        if (rows.length > 0) missingId = rows[0].id + 1;
        else missingId = 1;
        return chai.request(app).put(`/api/users/${missingId}`).send({ email, password });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('User profile with that ID not found');
        resp.error.status.should.equal(404);
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 400 if missing email and password in json', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        return chai.request(app).put(`/api/users/${rows[0].id}`).send({ useless: 'data' });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide an update to the email or password');
        resp.error.status.should.equal(400);
        return resolve();
      });
    });
  });

  it('returns 400 for bad email', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        return chai.request(app).put(`/api/users/${rows[0].id}`).send({ email: 'bad' });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid new email');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 400 for bad password', () => {
    return new Promise<void>((resolve, reject) => {
      let uId: number;
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        uId = rows[0].id;
        return chai.request(app).put(`/api/users/${uId}`).send({ password: 'abcdefgh' });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid new password');
        return chai.request(app).put(`/api/users/${uId}`).send({ password: '123' });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid new password');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('updates user profile correctly', () => {
    return new Promise<void>((resolve, reject) => {
      let profile: User;
      const testEmail = 'test@gmail.com', testPw = 'abc123';
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        profile = rows[0];
        return chai.request(app).put(`/api/users/${profile.id}`).send({ email: testEmail, password: testPw });
      }).then(resp => {
        return client.query('SELECT * FROM users WHERE id = $1;', [profile.id]);
      }).then(rows => {
        expect(rows.length).to.equal(1);
        profile = rows[0];
        return bcrypt.compare(testPw, profile.password);
      }).then(pwMatch => {
        expect(profile.email).to.equal(testEmail);
        expect(pwMatch).to.equal(true);
        return resolve();
      }).catch(() => reject());
    });
  });

  // delete
  it('returns 400 for requests without id', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).delete('/api/users').send({ email, password }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Request /api/users/user_id, not /api/users');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 404 for nonexistant user id', () => {
    return new Promise<void>((resolve, reject) => {
      client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(rows => {
        let missingId: number;
        if (rows.length > 0) missingId = rows[0].id + 1;
        else missingId = 1;
        return chai.request(app).delete(`/api/users/${missingId}`);
      }).then(resp => {
        expect(resp.status, '404 status').to.equal(404);
        expect(resp.error.text, 'Correct error msg').to.equal('User profile with that ID not found');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('deletes the requested user and rows', () => {
    return new Promise<void>((resolve, reject) => {
      let uId: number;
      chai.request(app).post('/api/users').send({ email, password }).then(() => {
        return client.query('SELECT id FROM users WHERE email = $1;', [email]);
      }).then(rows => {
        uId = rows[0].id;
        return chai.request(app).delete(`/api/users/${uId}`);
      }).then(resp => {
        expect(resp.status).to.equal(200);
        return client.query('SELECT id FROM users WHERE id = $1;', [uId]);
      }).then(rows => {
        expect(rows.length).to.equal(0);
        return client.query('SELECT id FROM list_metadata WHERE user_id = $1;', [uId]);
      }).then(rows => {
        expect(rows.length).to.equal(0);
        return resolve();
      }).catch(() => reject());
    });
  });

});
