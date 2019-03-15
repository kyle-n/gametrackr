import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { GiantBombGame } from '../../schemas';
import jwt from 'jsonwebtoken';

chai.use(chaiHttp);
let firstToken: string;
let secondToken: string;
let firstUserId: number
let secondUserId: number;
const firstEmail = 'test@test.com';
const password = 'abc123';
const secondEmail = 'test2@test.com';
const custom: {
  name: string;
  deck: string;
  original_release_date: string;
  image: string;
  lists: number[];
} = {
  name: '123123123123123123',
  deck: '7329873297459837459837345345',
  original_release_date: '2008-12-21',
  image: 'http://i.imgur.com/G1CdQJz.png',
  lists: []
};

describe('Game API', () => {

  before(async done => {
    await client.query('DELETE FROM users WHERE email IN ($1:csv);', [[firstEmail, secondEmail]]);
    let resp: any = await chai.request(app).post('/api/external').send({ email: firstEmail, password });
    if (!resp.body.token) throw new Error();
    firstUserId = resp.body.id;
    firstToken = 'jwt ' + resp.body.token;
    custom.lists.push((await client.one('SELECT id FROM list_metadata WHERE user_id = $1;', firstUserId)).id);
    resp = await chai.request(app).post('/api/external').send({ email: secondEmail, password });
    if (!resp.body.token) throw new Error();
    secondUserId = resp.body.id;
    secondToken = 'jwt ' + resp.body.token;
  });

  afterEach(async done => {
    const customId: number = (await client.query('DELETE FROM games WHERE name = $1 RETURNING id;', custom.name))[0].id;
    await client.none('DELETE FROM list_entries WHERE game_id = $1;', customId);
    return done();
  });

  after(async done => {
    await client.none('DELETE FROM users WHERE email = $1;', firstEmail);
    await client.none('DELETE FROM users WHERE email = $1;', secondEmail);
    done();
  });

  // create
  it('returns 400 for POST missing custom game fields', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, name: undefined }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, deck: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, original_release_date: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, image: undefined });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return resolve();
      }).catch(e => {
        console.log(e);
        return reject();
      });
    });
  });

  it('returns 400 for POST without at least one list selected', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, lists: undefined }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, lists: [] });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
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
      chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, name: tooLong }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, deck: tooLong });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return chai.request(app).post('/api/games').set('authorization', firstToken).send({ ...custom, original_release_date: tooLong });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid name, description, release date and image with at least one list selected');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 403 for POST game to another user\'s list', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', secondToken).send(custom)
      .then(resp => {
        expect(resp.status).to.equal(403);
        expect(resp.error.text).to.equal('Cannot add a custom game to another user\'s list');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('correctly adds custom game on POST', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', firstToken).send(custom).then(resp => {
        expect(resp.status, '200 status').to.equal(200);
        return client.query('SELECT * FROM games WHERE name = $1;', custom.name);
      }).then(rows => {
        expect(rows.length, 'Game was inserted').to.equal(1);
        expect(rows[0].name).to.equal(custom.name);
        expect(rows[0].deck).to.equal(custom.deck);
        expect(rows[0].original_release_date).to.equal(custom.original_release_date);
        expect(rows[0].image).to.equal(custom.image);
        expect(rows[0].owner_id).to.equal(userId);
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

  // read
  it('returns 400 for GET without game id', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/games').set('authorization', firstToken).then(resp => {
        expect(resp.status).to.equal(400);
        expect(resp.error.text).to.equal('Request /api/games/game_id, not /api/games');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 404 for GET game not in db', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/games/2').set('authorization', firstToken).then(resp => {
        expect(resp.status).to.equal(404);
        expect(resp.error.text).to.equal('Could not find a game with the requested ID');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('GETs an existing game correctly', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', firstToken)
      .then(resp => {
        const gb = resp.body.results[0];
        setTimeout(() => {
          chai.request(app).get(`/api/games/${gb.id}`).set('authorization', firstToken).then(game => {
            expect(game.status).to.equal(200);
            expect(game.body.id).to.equal(gb.id);
            expect(game.body.guid).to.equal(gb.guid);
            expect(game.body.name).to.equal(gb.name);
            expect(game.body.deck).to.equal(gb.deck);
            expect(game.body.description).to.equal(gb.description);
            expect(game.body.original_release_date).to.equal(gb.original_release_date);
            expect(game.body.site_detail_url).to.equal(gb.site_detail_url);
            return resolve();
          });
        }, 1000);
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  }).timeout(3000);

  // update
  it('returns 400 on PUT with no useful params', () => {
    return new Promise<void>((resolve, reject) => {
      let gameId: number;
      chai.request(app).post('/api/games').set('authorization', firstToken).send(custom).then(() => {
        return client.query('SELECT id FROM games WHERE name = $1;', custom.name);
      }).then(rows => {
        gameId = rows[0].id;
        return chai.request(app).put(`/api/games/${gameId}`).set('authorization', firstToken).send({ useless: 'data' });
      }).then(resp => {
        expect(resp.status, '400 status').to.equal(400);
        expect(resp.error.text, 'Correct error msg').to.equal('Must provide a valid new name, description, release date or image');
        return resolve();
      }).catch(e => {
        console.log(e);
        return reject();
      });
    });
  });

  it('returns 404 on PUT to nonexistent game', () => {
    return new Promise<void>((resolve, reject) => {
      let badId: number;
      client.query('SELECT id FROM games ORDER BY id DESC LIMIT 1;').then(rows => {
        if (rows.length) badId = rows[0].id + 1;
        else badId = 1;
        return chai.request(app).put(`/api/games/${badId}`).set('authorization', firstToken).send(custom);
      }).then(resp => {
        expect(resp.status).to.equal(404);
        expect(resp.error.text).to.equal('Could not find a game with the requested ID');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 403 on PUT to non-custom game', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', firstToken).then(searchResp => {
        const tester = searchResp.body.results[0];
        setTimeout(() => {
          chai.request(app).put(`/api/games/${tester.id}`).set('authorization', firstToken).send(custom).then(resp => {
            expect(resp.status).to.equal(403);
            expect(resp.error.text).to.equal('Cannot update non-custom Giant Bomb games');
            return resolve();
          });
        }, 1000);
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  }).timeout(3000);

  it('returns 403 on PUT to other user\'s game', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/games').set('authorization', firstToken).send(custom)
      .then(() => {
        return client.query('SELECT id FROM games WHERE name = $1;', custom.name);
      }).then(rows => {
        return chai.request(app).put(`/api/games/${rows[0].id}`).set('authorization', secondToken).send({ ...custom, name: 'New name' });
      }).then(resp => {
        expect(resp.status).to.equal(403);
        expect(resp.error.text).to.equal('Cannot update another user\'s custom game');
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('PUTs an update correctly to a custom game', async () => {
    try {
      const mod = {
        name: 'New name',
        deck: 'New deck',
        original_release_date: '0000',
        image: 'image'
      };
      await chai.request(app).post('/api/games').set('authorization', firstToken).send(custom);
      const gameId: number = (await client.one('SELECT id FROM games WHERE name = $1;', custom.name)).id;
      const resp: any = await chai.request(app).put(`/api/games/${gameId}`).set('authorization', firstToken).send(mod);
      expect(resp.status).to.equal(200);
      const dbVersion = await client.one('SELECT * FROM games WHERE id = $1;', gameId);
      expect(dbVersion.name).to.equal(mod.name);
      expect(dbVersion.deck).to.equal(mod.deck);
      expect(dbVersion.original_release_date).to.equal(mod.original_release_date);
      expect(dbVersion.image).to.equal(mod.image);
      await client.none('UPDATE games SET name = $1 WHERE id = $2;', [custom.name, gameId]);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // delete
  it('returns 400 for DELETE without game id', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).delete('/api/games').set('authorization', firstToken).then(resp => {
        expect(resp.status).to.equal(400);
        expect(resp.error.text).to.equal('Request /api/games/game_id, not /api/games');
        resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 404 for DELETE nonexistent game', () => {
    return new Promise<void>((resolve, reject) => {
      let badId: number;
      client.query('SELECT id FROM games ORDER BY id desc LIMIT 1;').then(rows => {
        if (rows.length) badId = rows[0].id + 1;
        else badId = 1;
        return chai.request(app).delete(`/api/games/${badId}`).set('authorization', firstToken);
      }).then(resp => {
        expect(resp.status).to.equal(404);
        expect(resp.error.text).to.equal('Could not find a game with the requested ID');
        resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('returns 403 for DELETE Giant Bomb game', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', firstToken).then(searchResp => {
        let badId: number = searchResp.body.results[0].id;
        setTimeout(() => {
          chai.request(app).delete(`/api/games/${badId}`).set('authorization', firstToken)
          .then(resp => {
            expect(resp.status).to.equal(403);
            expect(resp.error.text).to.equal('Cannot delete non-custom Giant Bomb games');
            resolve();
          });
        }, 1000);
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  }).timeout(3000);

  it('returns 403 for DELETE another user\'s custom game', () => {
    return new Promise<void>((resolve, reject) => {
      let gameId: number;
      chai.request(app).post('/api/games').set('authorization', firstToken).send(custom).then(() => {
        return client.query('SELECT id FROM games WHERE owner_id = $1 AND name = $2;', [firstUserId, custom.name]);
      }).then(rows => {
        if (!rows.length) throw new Error();
        gameId = rows[0].id;
        return chai.request(app).delete(`/api/games/${gameId}`).set('authorization', secondToken);
      }).then(resp => {
        expect(resp.status).to.equal(403);
        expect(resp.error.text).to.equal('Cannot delete another user\'s custom game');
        resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('DELETEs a custom game correctly', () => {
    return new Promise<void>((resolve, reject) => {
      let gameId: number;
      chai.request(app).post('/api/games').set('authorization', firstToken).send(custom).then(() => {
        return client.query('SELECT id FROM games WHERE name = $1 AND owner_id = $2;', [custom.name, firstUserId]);
      }).then(rows => {
        gameId = rows[0].id;
        return chai.request(app).delete(`/api/games/${gameId}`).set('authorization', firstToken);
      }).then(resp => {
        expect(resp.status).to.equal(200);
        return client.query('SELECT id FROM games WHERE id = $1;', gameId);
      }).then(rows => {
        expect(rows.length).to.equal(0);
        resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

});