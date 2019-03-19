import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { ListEntry } from '../../schemas';
import { Response } from 'superagent';
import { objectEmpty } from '../../utils';

chai.use(chaiHttp);
let firstToken: string, secondToken: string;
let firstUserId: number, secondUserId: number, firstListId: number, secondListId: number;
const firstEmail = 'test@test.com', secondEmail = 'test2@test.com';
const password = 'abc123';
let entryOne: ListEntry, entryTwo: ListEntry;
const testList = { title: '3837467564673738239327467456645', deck: 'test' };
let route: string;
const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';

describe('List entry API', () => {

  before(done => {
    setTimeout(async () => {
      try {
      await client.none('DELETE FROM users WHERE email IN ($1:csv);', [[firstEmail, secondEmail]]);

      // first user
      let resp: Response = await chai.request(app).post('/api/external').send({ email: firstEmail, password });
      if (!resp.body.token) throw new Error();
      firstToken = 'jwt ' + resp.body.token;
      firstUserId = (await client.one('SELECT id FROM users WHERE email = $1;', firstEmail)).id;

      // second user
      resp = await chai.request(app).post('/api/external').send({ email: secondEmail, password });
      if (!resp.body.token) throw new Error();
      secondToken = 'jwt ' + resp.body.token;
      secondUserId = (await client.one('SELECT id FROM users WHERE email = $1;', secondEmail)).id;

      // list
      if (resp.status !== 200) throw new Error();
      firstListId = (await client.one('SELECT id FROM list_metadata WHERE user_id = $1;', firstUserId)).id;
      secondListId = (await client.one('SELECT id FROM list_metadata WHERE user_id = $1;', secondUserId)).id;
      route = `/api/lists/${firstListId}/entries`;
      resp = await chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', firstToken);
      entryOne = <ListEntry>{
        game_id: resp.body.results[0].id,
        text: 'Test entry here',
        list_id: firstListId
      };
      entryTwo = <ListEntry>{
        game_id: resp.body.results[1].id,
        text: 'Second entry here',
        list_id: firstListId
      };
      return done();
    } catch (e) { console.log(e, 'caughte'); throw new Error(); }
    }, 500);
  });

  afterEach(async () => {
    await client.none('DELETE FROM list_entries WHERE user_id IN ($1:csv);', [[firstUserId, secondUserId]]);
    return;
  });

  after(async () => {
    await client.none('DELETE FROM users WHERE id IN ($1:csv);', [[firstUserId, secondUserId]]);
    return;
  });

  // create
  it('returns 400 for POST entry missing a required field', async () => {
    try {
      const fourHundredMsg = 'Must provide a valid game ID and entry text';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send({ text: entryOne.text });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      resp = await chai.request(app).post(route).set('authorization', firstToken).send({ game_id: entryOne.game_id });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 for POST entry with an invalid text field', async () => {
    try {
      const fourHundredMsg = 'Must provide a valid game ID and entry text';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send({ ...entryOne, text: tooLong });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      return; 
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 500 for POST nonexistent list/game id', async () => {
    try {
      const internal = 'Internal server error';
      let badGameId: number, badListId: number;
      let rows: any[] = await client.query('SELECT id FROM games ORDER BY id DESC LIMIT 1;');
      if (rows.length) badGameId = rows[0].id + 1;
      else badGameId = 1;
      rows = await client.query('SELECT id FROM list_metadata ORDER BY id DESC LIMIT 1;');
      if (rows.length) badListId = rows[0].id + 1;
      else badListId = 1;

      let resp: Response = await chai.request(app).post(`/api/lists/${badListId}/entries`).set('authorization', firstToken).send(entryOne);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a list with the requested ID');
      resp = await chai.request(app).post(route).set('authorization', firstToken).send({ text: entryOne.text, game_id: badGameId });
      expect(resp.status).to.equal(500);
      expect(resp.error.text).to.equal(internal);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 404 for POST entry to other person\'s list', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', secondToken).send(entryOne);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find a list with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('creates a new list entry on POST and returns entry', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      expect(resp.status).to.equal(200);
      const dbEntry: ListEntry = <ListEntry>(await client.one('SELECT * FROM list_entries WHERE user_id = $1;', firstUserId));
      expect(dbEntry.game_id).to.equal(entryOne.game_id).to.equal(resp.body.game_id);
      expect(dbEntry.id).to.equal(resp.body.id);
      expect(dbEntry.list_id).to.equal(firstListId).to.equal(resp.body.list_id);
      expect(dbEntry.ranking).to.equal(1).to.equal(resp.body.ranking);
      expect(dbEntry.text).to.equal(entryOne.text).to.equal(resp.body.text);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // read
  it('returns 404 for GET nonexistent entry', async () => {
    try {
      const resp: Response = await chai.request(app).get(route + '/1').set('authorization', firstToken);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find an entry with the requested ID');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns all entries on a list on GET /api/lists/list_id/entries', async () => {
    try {
      await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      await chai.request(app).post(route).set('authorization', firstToken).send(entryTwo);
      const resp: Response = await chai.request(app).get(route).set('authorization', firstToken);
      expect(resp.status).to.equal(200);
      expect(resp.body.entries).to.be.an('array');
      expect(resp.body.entries.length).to.equal(2);
      expect(resp.body.entries[0].game_id).to.equal(entryOne.game_id);
      expect(resp.body.entries[1].game_id).to.equal(entryTwo.game_id);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns entries even for another user GET', async () => {
    try {
      const resp: Response = await chai.request(app).get(route).set('authorization', secondToken);
      expect(resp.status).to.equal(200);
      expect(resp.body.entries).to.be.an('array');
      expect(resp.body.entries.length).to.equal(0);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns a single entry on GET', async () => {
    try {
      await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const entryId: number = (await client.one('SELECT id FROM list_entries WHERE user_id = $1;', firstUserId)).id;
      const resp: Response = await chai.request(app).get(route + '/' + entryId).set('authorization', firstToken);
      expect(resp.status).to.equal(200);
      expect(objectEmpty(resp.body)).to.equal(false);
      expect(resp.body.id).to.equal(entryId);
      expect(resp.body.game_id).to.equal(entryOne.game_id);
      expect(resp.body.text).to.equal(entryOne.text);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // update
  it('returns 400 for PATCH entry missing both fields', async () => {
    try {
      const fourHundredMsg = 'Must provide valid new entry text';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const patchRoute = route + '/' + resp.body.id;
      resp = await chai.request(app).patch(patchRoute).set('authorization', firstToken).send({ useless: 'data' });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 for PATCH invalid text', async () => {
    try {
      const fourHundredMsg = 'Must provide valid new entry text';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const patchRoute = route + '/' + resp.body.id;
      resp = await chai.request(app).patch(patchRoute).set('authorization', firstToken).send({ text: tooLong });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('correctly PATCHes entry text', async () => {
    try {
      const editedText = 'xyz';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const patchRoute = route + '/' + resp.body.id;
      resp = await chai.request(app).patch(patchRoute).set('authorization', firstToken).send({ text: editedText });
      expect(resp.status).to.equal(200);
      expect(resp.body).to.be.an('object');
      const dbText: string = (await client.one('SELECT text FROM list_entries WHERE user_id = $1;', firstUserId)).text;
      expect(resp.body.text).to.equal(editedText).to.equal(dbText);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('returns 400 on PATCH without all entry IDs in list', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const entryId: number = resp.body.id;
      await chai.request(app).post(route).set('authorization', firstToken).send(entryTwo);
      const entries = [{ id: entryId, ranking: 2 }];
      resp = await chai.request(app).patch(route).set('authorization', firstToken).send({ entries });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(`You provided 1 list entries but the database has 2`);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('correctly PATCHes entry ranking', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const patchRoute = route + '/' + resp.body.id;
      const one: number = resp.body.id;
      resp = await chai.request(app).post(route).set('authorization', firstToken).send(entryTwo);
      const two: number = resp.body.id;
      resp = await chai.request(app).post(route).set('authorization', firstToken).send(entryTwo);
      const three: number = resp.body.id;
      const entries = [{ id: one, ranking: 2 }, { id: two, ranking: 1 }, { id: three, ranking: 3 }];
      resp = await chai.request(app).patch(patchRoute).set('authorization', firstToken).send({ entries });
      expect(resp.body.entries).to.be.an('array');
      expect(resp.body.entries.length).to.equal(3);
      expect(resp.body.entries[0].id).to.equal(one);
      expect(resp.body.entries[0].ranking).to.equal(2);
      expect(resp.body.entries[1].id).to.equal(two);
      expect(resp.body.entries[1].ranking).to.equal(1);
      expect(resp.body.entries[2].id).to.equal(three);
      expect(resp.body.entries[2].ranking).to.equal(3);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });
  return;

  // delete
  it('returns 404 for DELETE nonexistent entry', async () => {
    try {
      let badEntryId: number;
      const fourOhFourMsg = 'Could not find a list entry with the requested ID';
      const rows: any[] = await client.query('SELECT id FROM list_entries ORDER BY id DESC LIMIT 1;');
      if (rows.length) badEntryId = rows[0].id + 1;
      else badEntryId = 1;
      const resp: Response = await chai.request(app).delete(route + '/' + badEntryId).set('authorization', firstToken);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal(fourOhFourMsg);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('DELETEs all list entries on request /api/lists/:id/entries', async () => {
    try {
      await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const resp: Response = await chai.request(app).delete(route).set('authorization', firstToken);
      expect(resp.status).to.equal(200);
      const rows: any[] = await client.query('SELECT id FROM list_entries WHERE user_id = $1;', firstUserId);
      expect(rows.length).to.equal(0);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('DELETEs an entry on request', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const deleteRoute = route + '/' + resp.body.id;
      const entryId: number = resp.body.id;
      resp = await chai.request(app).delete(deleteRoute).set('authorization', firstToken);
      expect(resp.status).to.equal(200);
      await client.none('SELECT id FROM list_entries WHERE id = $1;', entryId);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  it('Returns 404 on DELETE another user\'s entries', async () => {
    try {
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send(entryOne);
      const deleteRoute = route + '/' + resp.body.id;
      const entryId: number = resp.body.id;
      resp = await chai.request(app).delete(deleteRoute).set('authorization', secondToken);
      expect(resp.status).to.equal(404);
      expect(resp.error.text).to.equal('Could not find an entry with the requested ID');
      await client.one('SELECT id FROM list_entries WHERE id = $1;', entryId);
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

});
