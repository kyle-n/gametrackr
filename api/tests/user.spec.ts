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
import bcrypt from 'bcrypt';

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

  // wipe test data
  afterEach(() => {
    return new Promise((resolve, reject) => {
      client.query('DELETE FROM users WHERE email = $1 RETURNING id;', [email]).then(data => {
        if (data.rowCount < 1) return resolve();
        client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING list_table_name;', [data.rows[0].id]).then(listData => {
          for (let i = 0; i < listData.rowCount; i++) {
            const row = listData.rows[i];
            client.query('DROP TABLE IF EXISTS $1;', [row.list_table_name]).then(() => {
              if (i === listData.rowCount - 1) return resolve();
            });
          }
        });
      }).catch(() => reject());
    });
  });

  // create
  it('returns 400 for requests missing a required field', done => {
    chai.request(app).post('/api/users').send({}).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Must provide an email address and password');
      resp.error.status.should.equal(400);
    })
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
        let profile: User;
        client.query('SELECT * FROM users WHERE email = $1;', [email]).then(data => {
          expect(data.rowCount).to.equal(1);
          profile = data.rows[0];
          return bcrypt.compare(password, profile.password);
        }).then(pwMatch => {
          expect(pwMatch).to.equal(true);
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

  // update
  it('returns 400 for requests without id', done => {
    chai.request(app).put('/api/users').send({ email, password }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Request /api/users/user_id, not /api/users');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 404 for nonexistant user id', done => {
    client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(data => {
      let missingId: number;
      if (data.rowCount > 0) missingId = data.rows[0].id + 1;
      else missingId = 1;
      return chai.request(app).put(`/api/users/${missingId}`).send({ email, password });
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('User profile with that ID not found');
      resp.error.status.should.equal(404);
      return done();
    });
  });

  it('returns 400 if missing email and password in json', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          return chai.request(app).put(`/api/users/${data.rows[0].id}`).send({ useless: 'data' });
        }).then(resp => {
          resp.error.text.should.be.a('string');
          resp.error.text.should.equal('Must provide an update to the email or password');
          resp.error.status.should.equal(400);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  it('returns 400 for bad email', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          return chai.request(app).put(`/api/users/${data.rows[0].id}`).send({ email: 'bad' });
        }).then(resp => {
          resp.error.text.should.be.a('string');
          resp.error.text.should.equal('Must provide a valid new email');
          resp.error.status.should.equal(400);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  it('returns 400 for bad password', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        let uId: number;
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          uId = data.rows[0].id;
          return chai.request(app).put(`/api/users/${uId}`).send({ password: 'abcdefgh' });
        }).then(resp => {
          resp.error.text.should.be.a('string');
          resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
          resp.error.status.should.equal(400);
          return chai.request(app).put(`/api/users/${uId}`).send({ password: '123' });
        }).then(resp => {
          resp.error.text.should.be.a('string');
          resp.error.text.should.equal('Password should be at least 6 characters and use at least one number');
          resp.error.status.should.equal(400);
          return done();
        });
      }, 1000);
    });
  }).timeout(3000);

  it('updates user profile correctly', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        let profile: User;
        const testEmail = 'test@gmail.com', testPw = 'abc123';
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          profile.id = data.rows[0].id;
          return chai.request(app).put(`/api/users/${profile.id}`).send({ email: testEmail, password: testPw });
        }).then(resp => {
          return client.query('SELECT * FROM users WHERE id = $1;', [profile.id]);
        }).then(data => {
          expect(data.rowCount).to.equal(1);
          profile = data.rows[0];
          return bcrypt.compare(testPw, profile.password);
        }).then(pwMatch => {
          expect(profile.email).to.equal(testEmail);
          expect(pwMatch);
          return client.query('UPDATE users SET email = $1 WHERE id = $2;', [email, profile.id]);
        }).then(() => done());
      }, 1000);
    });
  }).timeout(3000);

  // delete
  it('returns 400 for requests without id', done => {
    chai.request(app).delete('/api/users').send({ email, password }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('Request /api/users/user_id, not /api/users');
      resp.error.status.should.equal(400);
      return done();
    });
  });

  it('returns 404 for nonexistant user id', done => {
    client.query('SELECT id FROM users ORDER BY id DESC LIMIT 1;').then(data => {
      let missingId: number;
      if (data.rowCount > 0) missingId = data.rows[0].id + 1;
      else missingId = 1;
      return chai.request(app).delete(`/api/users/${missingId}`);
    }).then(resp => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('User profile with that ID not found');
      resp.error.status.should.equal(404);
      return done();
    });
  });

  it('deletes the requested user and rows', done => {
    chai.request(app).post('/api/users').send({ email, password }).then(() => {
      setTimeout(() => {
        let uId: number;
        client.query('SELECT id FROM users WHERE email = $1;', [email]).then(data => {
          uId = data.rows[0].id;
          return chai.request(app).delete(`/api/users/${uId}`);
        }).then(resp => {
          expect(resp.status).to.equal(200);
          return client.query('SELECT id FROM users WHERE id = $1;', [uId]);
        }).then(data => {
          expect(data.rowCount).to.equal(0);
          return client.query('SELECT id FROM list_metadata WHERE user_id = $1;', [uId]);
        }).then(data => {
          expect(data.rowCount).to.equal(0);
          return done();
        })
      }, 1000);
    });
  }).timeout(3000);

});
