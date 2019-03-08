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
const email = 'test@test.com', password = 'abc123';
const title = 'Test list', deck = 'Test deck';

describe('Router list api interface', () => {

  before(done => {
    setTimeout(() => {
      client.query('SELECT id FROM users WHERE email = $1;', [email]).then(rows => {
        if (!rows.length) return chai.request(app).post('/api/users').send({ email, password });
        return client.query('SELECT list_table_name FROM list_metadata WHERE user_id = $1;', [rows[0].id]);
      }).then(rowOrResp => {
        if (rowOrResp.status) return setTimeout(done, 500);
        if (rowOrResp.length === 1 && rowOrResp[0].list_table_name.toLowerCase() === 'played games') return done();
        for (let i = 0; i < rowOrResp.length; i++) {
          if (rowOrResp[i].list_table_name.toLowerCase() === 'played games') {
            if (i === rowOrResp.length - 1) return done();
            else continue;
          }
          client.query('DROP TABLE IF EXISTS $1~;', rowOrResp[i].list_table_name).then(() => {
            if (i === rowOrResp.length - 1) return done();
          });
        }
      });
    }, 500);
  });

  afterEach(done => {
    client.query('SELECT id FROM users WHERE email = $1;', email).then(rows => {
      if (!rows.length) return done();
      client.query('SELECT list_table_name FROM list_metadata WHERE user_id = $1;', rows[0].id).then(listRows => {
        const tablesToDelete = listRows.filter((lr: any) => lr.list_table_name.toLowerCase() !== 'played games').map((lr: any) => lr.list_table_name);
        for (let i = 0; i < tablesToDelete.length; i++) {
          client.query('DROP TABLE IF EXISTS $1~;', tablesToDelete[i]).then(() => {
            if (i === tablesToDelete.length - 1) return done();
          })
        }
      });
    });
  });

  // create
  it('returns 400 for new list requests missing a required field', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/lists').send({ title }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        return chai.request(app).post('/api/lists').send({ deck });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        const tooLong = 'String of more than twenty characters, the limit for titles';
        return chai.request(app).post('/api/lists').send({ title: tooLong, deck });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
        return chai.request(app).post('/api/lists').send({ title, deck: tooLong });
      }).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('Must provide a valid title and deck');
        resp.error.status.should.equal(400);
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    });
  });

});
