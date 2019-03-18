import { describe, it, before, afterEach, after } from 'mocha';
import { app } from '../../server';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import { ListEntry } from '../../schemas';
import { Response } from 'superagent';

chai.use(chaiHttp);
let firstToken: string, secondToken: string;
let firstUserId: number, secondUserId: number, listId: number;
const firstEmail = 'test@test.com', secondEmail = 'test2@test.com';
const password = 'abc123';
let entryOne: ListEntry, entryTwo: ListEntry;
const testList = { title: '3837467564673738239327467456645', deck: 'test' };

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
      resp = await chai.request(app).post('/api/lists').set('authorization', firstToken).send(testList)
      if (resp.status !== 200) throw new Error();
      listId = (await client.one('SELECT id FROM list_metadata WHERE user_id = $1;', firstUserId)).id;
      resp = await chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', firstToken);
      entryOne = <ListEntry>{
        game_id: resp.body.results[0].id,
        text: 'Test entry here',
        list_id: listId
      };
      entryTwo = <ListEntry>{
        game_id: resp.body.results[1].id,
        text: 'Second entry here',
        list_id: listId
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

})
