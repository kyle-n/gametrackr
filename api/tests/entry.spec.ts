import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { ListEntry } from '../../schemas';
import { Response } from 'superagent';

chai.use(chaiHttp);
let firstToken: string, secondToken: string;
let firstUserId: number, secondUserId: number, firstListId: number, secondListId: number;
const firstEmail = 'test@test.com', secondEmail = 'test2@test.com';
const password = 'abc123';
let entryOne: ListEntry, entryTwo: ListEntry;
const testList = { title: '3837467564673738239327467456645', deck: 'test' };
let route: string;

describe('List entry API', () => {

  before(done => {
    setTimeout(async () => {
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
    }, 800);
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
      const fourHundredMsg = 'Must provide a valid game ID, entry text and list ID';
      let resp: Response = await chai.request(app).post(route).set('authorization', firstToken).send({ ...entryOne, game_id: undefined });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      resp = await chai.request(app).post(route).set('authorization', firstToken).send({ ...entryOne, text: undefined });
      expect(resp.status).to.equal(400);
      expect(resp.error.text).to.equal(fourHundredMsg);
      resp = await chai.request(app).post(route).set('authorization', firstToken).send({ ...entryOne, list_id: undefined });
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
      const tooLong = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin non arcu leo. Vestibulum dignissim consequat velit nec accumsan. Phasellus molestie vel metus nec vulputate. Phasellus sit amet elementum erat. Nulla sollicitudin dolor ut bibendum tempor. Proin vitae cursus felis. Ut aliquam erat quis molestie interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Integer consectetur leo congue, faucibus arcu at, porttitor eros. Donec consectetur justo sed ultrices rutrum. Etiam tincidunt, leo nec consequat pharetra, dolor ligula vehicula elit, vel ultricies erat nibh a nisi. Duis euismod sem orci, a ornare sem fermentum et.';
      const fourHundredMsg = 'Must provide a valid game ID, entry text and list ID';
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
      let rows: any[] = await client.query('SELECT id FROM games GROUP BY id DESC LIMIT 1;');
      if (rows.length) badGameId = rows[0] + 1;
      else badGameId = 1;
      rows = await client.query('SELECT id FROM lists GROUP BY id DESC LIMIT 1;');
      if (rows.length) badListId = rows[0] + 1;
      else badListId = 1;

      let resp: Response = await chai.request(app).post(`/api/lists/${badListId}/entries`).set('authorization', firstToken).send(entryOne);
      expect(resp.status).to.equal(500);
      expect(resp.error.text).to.equal(internal);
      resp = await chai.request(app).post(route).set('authorization', firstToken).send({ ...entryOne, game_id: badGameId });
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
      expect(resp.error.text).to.equal('Could not find a list entry with the requested ID');
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
      expect(resp.body.entry).to.be.an('object');
      return;
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  });

  // update

});
