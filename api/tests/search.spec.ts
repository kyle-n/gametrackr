// setup and config
import SearchRouter from '../search';
import { app } from '../../server';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Client } from 'pg';
import { connectionUrl } from '../../db';

chai.use(chaiHttp);
const should = chai.should();
const client: Client = new Client(connectionUrl);
client.connect();

describe('GB search API', () => {
  beforeEach(done => {
    client.query('DELETE FROM ONLY games;').then(() => {
      return client.query('DELETE FROM ONLY platforms;');
    }).then(() => {
      return client.query('DELETE FROM ONLY game_images;');
    }).then(() => done());
  });

  it('return 400 for no query', () => {
    chai.request(app).get('/api/search').end((e, resp) => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('No search query');
      resp.error.status.should.equal(400);
    });
  });
});