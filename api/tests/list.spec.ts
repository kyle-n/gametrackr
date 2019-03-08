import { app } from '../../server';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import IceKingJson from '../../schemas/iceking.json';
import { GiantBombGame, ServerError, List, ListEntry, GiantBombPlatform } from '../../schemas';
import { client } from '../../db';

// config
chai.use(chaiHttp);
const should = chai.should();
const defaultError: ServerError = { status: 500, msg: 'Internal server error' };
const email = process.env.TEST_EMAIL, password = process.env.TEST_PASSWORD;
const title = 'Test list', deck = 'Test deck';
let token: string;
let userId: number;

describe('Router list api interface', () => {

  before(done => {
    setTimeout(() => {
      client.query('SELECT id FROM users WHERE email = $1;', email).then(rows => {
        // login if there's a test account, otherwise create one
        if (rows.length) return chai.request(app).post('/api/external/login').send({ email, password });
        else return chai.request(app).post('/api/external').set('authorization', token).send({ email, password });
      }).then(resp => {
        token = 'jwt ' + resp.body.token;
        return client.query('SELECT id FROM users WHERE email = $1;', email);
      }).then(rows => {
        userId = rows[0].id;
        return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING list_table_name;', userId);
      }).then(rows => {
        if (!rows.length) return done();
        rows.forEach((table: any, i: number)=> {
          client.query('DROP TABLE IF EXISTS $1~;', table.list_table_name).then(() => {
            if (i === rows.length - 1) return done()
          });
        });
      });
    }, 500);
  });

  afterEach(done => {
    client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING list_table_name;', userId).then(rows => {
      if (!rows.length) return done();
      rows.forEach((table: any, i: number) => {
        client.query('DROP TABLE IF EXISTS $1~;', table.list_table_name).then(() => {
          if (i === rows.length - 1) return done();
        });
      });
    });
  });

  after(done => {
    client.query('DELETE FROM users WHERE id = $1;', userId).then(() => done());
  });

  // create
  it('returns 400 for bad new list requests', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/lists').set('authorization', token).send({ title }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        return chai.request(app).post('/api/lists').set('authorization', token).send({ deck });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        const tooLong = 'String of more than twenty characters, the limit for titles';
        return chai.request(app).post('/api/lists').set('authorization', token).send({ title: tooLong, deck });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
        return chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck: tooLong });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    });
  });

  it('correctly saves a new list', () => {
    return new Promise<void>((resolve, reject) => {
      let tableResponseName: string;
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        resp.status.should.equal(200);
        resp.body.listTableName.should.be.a('string');
        tableResponseName = resp.body.listTableName;
        return client.query('SELECT * FROM list_metadata WHERE list_table_name = $1;', resp.body.listTableName);
      }).then(rows => {
        expect(rows.length).to.equal(1);
        expect(rows[0].list_table_name).to.equal(tableResponseName);
        expect(rows[0].user_id).to.equal(userId);
        expect(rows[0].title).to.equal(title);
        expect(rows[0].deck).to.equal(deck);
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    })
  }).timeout(3000);

});
