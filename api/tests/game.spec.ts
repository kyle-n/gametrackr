import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { GiantBombGame } from '../../schemas';

chai.use(chaiHttp);
let token: string;
let userId: number;
const custom: GiantBombGame = <GiantBombGame>{
  name: 'Spelunky Classic',
  deck: 'Spelunky is a cave exploration / treasure-hunting game inspired by classic platform games and roguelikes, where the goal is to grab as much treasure from the cave as possible.',
  original_release_date: '2008-12-21',
  image: 'http://i.imgur.com/G1CdQJz.png'
};

describe('Game API', () => {

  before(done => {
    chai.request(app).post('/api/external').send({ email: 'test@test.com', password: 'abc123' }).then(resp => {
      token = 'jwt ' + resp.body.token;
      return client.query('SELECT id FROM users WHERE email = $1;', 'test@test.com');
    }).then(rows => {
      userId = rows[0].id;
      return done();
    });
  });

  after(done => {
    client.query('DELETE FROM users WHERE id = $1;', userId).then(rows => {
      return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING id;', userId);
    }).then(rows => {
      return client.query('DELETE FROM list_entries WHERE list_id IN ($1:list) RETURNING game_id;', rows.map((r: any) => r.id));
    }).then(rows => {
      return client.query('DELETE FROM games WHERE custom = true AND id IN ($1:list);', rows.map((r: any) => r.game_id));
    }).then(() => done());
  });

  // create
  it('returns 400 for POST missing custom game fields', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, name: undefined }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, deck: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, original_release_date: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, image: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return resolve();
      }).catch(e => {
        console.log(e);
        return reject();
      });
    });
  });

});