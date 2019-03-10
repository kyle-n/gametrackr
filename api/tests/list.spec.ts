import { app } from '../../server';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { List } from '../../schemas';
import { client } from '../../db';
import { objectEmpty } from '../../utils';

// config
chai.use(chaiHttp);
const should = chai.should();
const email = 'test@test.com', password = 'abc123';
const title = 'Test list', deck = 'Test deck';
let token: string;
let userId: number;

describe('Router list api interface', () => {

  before(done => {
    setTimeout(() => {
      console.log('initial query');
      client.query('SELECT id FROM users WHERE email = $1;', email).then(rows => {
        // login if there's a test account, otherwise create one
        console.log('about to request');
        if (rows.length) return chai.request(app).post('/api/external/login').send({ email, password });
        else return chai.request(app).post('/api/external').send({ email, password });
      }).then(resp => {
        console.log(resp.body, 'got resp');
        console.log(resp.error);
        token = 'jwt ' + resp.body.token;
        return client.query('SELECT id FROM users WHERE email = $1;', email);
      }).then(rows => {
        console.log(rows, 'should be a created user');
        userId = rows[0].id;
        return client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING id;', userId);
      }).then(rows => {
        if (!rows.length) return done();
        client.query('DELETE FROM list_entries WHERE list_id = ANY($1);', [rows.map((r: any) => r.id)]).then(() => done());
      }).catch(e => console.log(e));
    }, 800);
  });

  afterEach(done => {
    client.query('DELETE FROM list_metadata WHERE user_id = $1 RETURNING id;', userId).then(rows => {
      if (!rows.length) return done();
      client.query('DELETE FROM list_entries WHERE list_id = ANY($1);', [rows.map((r: any) => r.id)]).then(() => {
    });
  });

  after(done => {
    client.query('DELETE FROM users WHERE id = $1;', userId).then(() => done());
  });

  // create
  it('returns 400 for bad new list requests', () => {
    const validWarning = 'Must provide a valid title and deck';
    return new Promise<void>((resolve, reject) => {
      chai.request(app).post('/api/lists').set('authorization', token).send({ title }).then(resp => {
        expect(resp.error.status, 'Missing deck, status should be 400').to.equal(400);
        expect(resp.error.text, 'Missing deck, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Missing deck, error text should be "${validWarning}"`).to.equal(validWarning);
        return chai.request(app).post('/api/lists').set('authorization', token).send({ deck });
      }).then(resp => {
        expect(resp.error.status, 'Missing title, status should be 400').to.equal(400);
        expect(resp.error.text, 'Missing title, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Missing title, error text should be "${validWarning}"`).to.equal(validWarning);
        const tooLong = 'String of more than twenty characters, the limit for titles';
        return chai.request(app).post('/api/lists').set('authorization', token).send({ title: tooLong, deck });
      }).then(resp => {
        expect(resp.error.status, 'Too long title, status should be 400').to.equal(400);
        expect(resp.error.text, 'Too long title, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Too long title, error text should be "${validWarning}"`).to.equal(validWarning);
        const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
        return chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck: tooLong });
      }).then(resp => {
        expect(resp.error.status, 'Too long deck, status should be 400').to.equal(400);
        expect(resp.error.text, 'Too long deck, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Too long deck, error text should be "${validWarning}"`).to.equal(validWarning);
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    });
  });

  it('correctly saves a new list', () => {
    return new Promise<void>((resolve, reject) => {
      let listRespId: number;
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        expect(resp.status, 'Create list status should be 200').to.equal(200);
        expect(resp.body.listId, 'server should return list id').to.be.a('number');
        listRespId = resp.body.listId;
        return client.query('SELECT * FROM list_metadata WHERE id = $1;', resp.body.listId);
      }).then(rows => {
        expect(rows.length, 'test user should have only one list').to.equal(1);
        expect(rows[0].id, 'response id should equal db id').to.equal(listRespId);
        expect(rows[0].user_id, 'saved db list user_id should equal test test id').to.equal(userId);
        expect(rows[0].title, 'title saved to db should equal title input to api').to.equal(title);
        expect(rows[0].deck, 'deck saved to db should equal deck input to api').to.equal(deck);
        expect(rows[0].private, 'db list is private by default').to.equal(true);
        return client.query('SELECT id FROM list_entries WHERE list_id = $1;', listRespId);
      }).then(rows => {
        expect(rows.length, 'Zero entries on new empty list').to.equal(0);
        return resolve();
      }).catch(e => { console.log(e); reject(); });
    });
  });

  // read
  it('returns 400 for get request without a list id', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).get('/api/lists').set('authorization', token).then(resp => {
        expect(resp.status, 'resp.status should be 400 for /api/lists (no listId)').to.equal(400);
        expect(resp.error.text, 'resp error text should be a string').to.be.a('string');
        expect(resp.error.text, 'resp error msg should be "Request /api/lists/list_id, not /api/lists"').to.equal('Request /api/lists/list_id, not /api/lists');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 404 for get nonexistent list', () => {
    return new Promise((resolve, reject) => {
      client.query('SELECT id FROM list_metadata ORDER BY id DESC LIMIT 1;').then(rows => {
        let badId = 1;
        if (rows.length) badId = rows[0].id + 1;
        return chai.request(app).get(`/api/lists/${badId}`).set('authorization', token);
      }).then(resp => {
        expect(resp.status, '404 status').to.equal(404);
        expect(resp.error.text, 'Correct error msg').to.equal('Could not find a list with the requested ID');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns a list correctly', () => {
    return new Promise((resolve, reject) => {
      let list: List;
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        return chai.request(app).get('/api/lists').set('authorization', token);
      }).then(resp => {
        expect(resp.status, 'Get list status should be 200').to.equal(200);
        expect(objectEmpty(resp.body), 'Response body should not be empty').to.not.equal(true);
        expect(resp.body.title, 'Returns list title').to.be.a('string');
        expect(resp.body.deck, 'Returns list deck').to.be.a('string');
        expect(resp.body.id, 'Returns list id').to.be.a('number');
        expect(resp.body.private, 'Private by default').to.equal(true);
        expect(resp.body.entries, 'Returns list entries').to.be.an('array');
        expect(resp.body.entries, 'Should be no game entries').to.equal(0);
        list = resp.body;
        return client.query('SELECT id, title, deck, private FROM list_metadata WHERE user_id = $1;', userId);
      }).then(rows => {
        expect(rows.length, 'Should only have one list').to.equal(1);
        expect(rows[0].title, 'Db title should equal returned title').to.equal(list.title);
        expect(rows[0].deck, 'Db deck should equal returned deck').to.equal(list.deck);
        expect(rows[0].id, 'Db list id should equal returned id').to.equal(list.id);
        expect(rows[0].private, 'Db list private by default').to.equal(true);
        return client.query('SELECT id FROM list_entries WHERE list_id = $1;', rows[0].id);
      }).then(rows => {
        expect(rows.length, 'Db entries should match returned entries').to.equal(list.entries.length);
        return resolve();
      }).catch(() => reject());
    });
  });

  // update
  it('returns 400 for a bad update request', () => {
    return new Promise((resolve, reject) => {
      let listId: number;
      const validWarning = 'Must provide a valid title and deck';
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        listId = resp.body.listId;
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title });
      }).then(resp => {
        expect(resp.status, 'No deck, resp.status should be 400').to.equal(400);
        expect(resp.error.text, 'No deck, error text should be a string').to.be.a('string');
        expect(resp.error.text, `No deck, error text should be "${validWarning}"`).to.equal(validWarning);
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ deck });
      }).then(resp => {
        expect(resp.status, 'No title, resp.status should be 400').to.equal(400);
        expect(resp.error.text, 'No title, error text should be a string').to.be.a('string');
        expect(resp.error.text, `No title, error text should be "${validWarning}"`).to.equal(validWarning);
        const tooLong = 'String of more than twenty characters, the limit for titles';
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title: tooLong, deck });
      }).then(resp => {
        expect(resp.error.status, 'Too long title, status should be 400').to.equal(400);
        expect(resp.error.text, 'Too long title, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Too long title, error text should be "${validWarning}"`).to.equal(validWarning);
        const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title, deck: tooLong });
      }).then(resp => {
        expect(resp.error.status, 'Too long deck, status should be 400').to.equal(400);
        expect(resp.error.text, 'Too long deck, error text should be a string').to.be.a('string');
        expect(resp.error.text, `Too long deck, error text should be "${validWarning}"`).to.equal(validWarning);
        return resolve();
      }).catch(() => reject());
    });
  });

  it('returns 404 for updating nonexistent list', () => {
    return new Promise((resolve, reject) => {
      client.query('SELECT id FROM list_metadata ORDER BY id DESC LIMIT 1;').then(rows => {
        let badId = 1;
        if (rows.length) badId = rows[0].id + 1;
        return chai.request(app).put(`/api/lists/${badId}`).set('authorization', token).send({ title, deck });
      }).then(resp => {
        expect(resp.status, '404 status').to.equal(404);
        expect(resp.error.text, 'Correct error msg').to.equal('Cannot find a list with the requested ID');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('updates a list correctly', () => {
    return new Promise((resolve, reject) => {
      const editedTitle = '', editedDeck = '';
      let listId: number;
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        listId = resp.body.listId;
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title: editedTitle, deck: editedDeck });
      }).then(resp => {
        expect(resp.status, 'Response to valid update should be 200').to.equal(200);
        return client.query('SELECT title, deck FROM list_metadata WHERE id = $1;', listId);
      }).then(rows => {
        if (!rows.length) throw new Error();
        expect(rows[0].title, 'Db title should equal update title').to.equal(editedTitle);
        expect(rows[0].deck, 'Db deck should equal updated deck').to.equal(editedDeck);
        return client.query('UPDATE list_metadata SET title = $1, deck = $2 WHERE id = $3;', [title, deck, listId]);
      }).then(rows => {
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title: editedTitle, deck: null });
      }).then(resp => {
        expect(resp.status, 'Resp.status to update just title should be 200').to.equal(200);
        return chai.request(app).put(`/api/lists/${listId}`).set('authorization', token).send({ title: null, deck: editedDeck });
      }).then(resp => {
        expect(resp.status, 'Resp.status to update just deck should be 200').to.equal(200);
        return client.query('SELECT title, deck FROM list_metadata WHERE id = $1;', listId);
      }).then(rows => {
        if (!rows.length) throw new Error();
        expect(rows[0].title, 'Single field title update should flow to db').to.equal(editedTitle);
        expect(rows[0].deck, 'Single field deck update should flow to db').to.equal(editedDeck);
        return resolve();
      }).catch(() => reject());
    });
  });

  // delete
  it('returns 400 for a bad delete request', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        return chai.request(app).delete('/api/lists').set('authorization', token);
      }).then(resp => {
        expect(resp.status, 'Delete without list id should return 400').to.equal(400);
        expect(resp.error.text, 'Error message for no list specified should be "Request /api/lists/list_id, not /api/lists"').to.equal('Request /api/lists/list_id, not /api/lists');
        return resolve();
      }).catch(() => reject());
    });
  });
  
  it('returns 404 for deleting list not in db', () => {
    return new Promise((resolve, reject) => {
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        return client.query('SELECT id FROM list_metadata ORDER BY id DESC LIMIT 1;');
      }).then(rows => {
        return chai.request(app).delete(`/api/lists/${rows[0].id + 1}`).set('authorization', token);
      }).then(resp => {
        expect(resp.status, 'Returns 404 when trying to delete nonexistant list').to.equal(404);
        expect(resp.error, 'Returns error msg for 404 delete').to.equal('Cannot find a list with the requested ID');
        return resolve();
      }).catch(() => reject());
    });
  });

  it('deletes a list correctly', () => {
    return new Promise((resolve, reject) => {
      let listId: number;
      chai.request(app).post('/api/lists').set('authorization', token).send({ title, deck }).then(resp => {
        listId = resp.body.listId;
        return chai.request(app).delete(`/api/lists/${listId}`).set('authorization', token);
      }).then(resp => {
        expect(resp.status, 'Valid delete status 200').to.equal(200);
        return client.query('SELECT id FROM list_metadata WHERE id = $1;', listId);
      }).then(rows => {
        expect(rows.length, 'List deleted from list_metadata').to.equal(0);
        return client.query('SELECT id FROM list_entries WHERE list_id = $1;', listId);
      }).then(rows => {
        expect(rows.length, 'List entries deleted').to.equal(0);
        return resolve();
      }).catch(() => reject());
    });
  });

});
