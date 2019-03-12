import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { GiantBombGame } from '../../schemas';

chai.use(chaiHttp);
let token: string;
let userId: number;
const custom = {
  name: 'Spelunky Classic',
  deck: 'Spelunky is a cave exploration / treasure-hunting game inspired by classic platform games and roguelikes, where the goal is to grab as much treasure from the cave as possible.',
  original_release_date: '2008-12-21',
  image: 'http://i.imgur.com/G1CdQJz.png',
  lists: []
};

describe('Game API', () => {

  before(done => {
    chai.request(app).post('/api/external').send({ email: 'test@test.com', password: 'abc123' }).then(resp => {
      token = 'jwt ' + resp.body.token;
      return client.query('SELECT id FROM users WHERE email = $1;', 'test@test.com');
    }).then(rows => {
      userId = rows[0].id;
      return client.query('SELECT id FROM list_metadata WHERE user_id = $1;', userId);
    }).then(rows => {
      custom.lists.concat(rows.map((r: any) => r.id));
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

  it('returns 400 without at least one list selected', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).post('/api/users').set('authorization', token).send({ ...custom, lists: undefined }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must select at least one list to receive your custom game');
        return chai.request(app).post('/api/users').set('authorization', token).send({ ...custom, lists: [] });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must select at least one list to receive your custom game');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 400 for POST with field that breaks rules', () => {
    return new Promise((resolve, reject) => {
      const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
      chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, name: tooLong }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, deck: tooLong });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
        return chai.request(app).post('/api/games').set('authorization', token).send({ ...custom, original_release_date: tooLong });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image');
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('correctly adds custom game on POST', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', token).send(custom).then(resp => {
        expect(resp.status, '200 status').to.equal(200);
        return client.query('SELECT * FROM games WHERE name = $1;', custom.name);
      }).then(rows => {
        expect(rows.length, 'Game was inserted').to.equal(1);
        expect(rows[0].name).to.equal(custom.name);
        expect(rows[0].deck).to.equal(custom.deck);
        expect(rows[0].original_release_date).to.equal(custom.original_release_date);
        expect(rows[0].image).to.equal(custom.image);
        return client.query('SELECT id FROM list_entries WHERE list_id IN ($1:list) AND game_id = $2;', [custom.lists, rows[0].id]);
      }).then(rows => {
        expect(rows.length).to.equal(custom.lists.length);
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

});