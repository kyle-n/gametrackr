// setup and config
import { app } from '../../server';
import { searchGiantBomb, saveGames, savePlatforms } from '../search';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Client } from 'pg';
import { connectionUrl } from '../../db';
import sinon from 'sinon';
import axios from 'axios';

chai.use(chaiHttp);
const should = chai.should();
const client: Client = new Client(connectionUrl);
client.connect();

describe('Client router interface', () => {
  let fakeGet: sinon.SinonSpy;
  beforeEach(done => {
    fakeGet = sinon.spy(axios, 'get');
    axios.get = fakeGet;
    client.query('DELETE FROM ONLY games;').then(() => {
      return client.query('DELETE FROM ONLY platforms;');
    }).then(() => {
      return client.query('DELETE FROM ONLY game_images;');
    }).then(() => done());
  });

  afterEach(() => {
    sinon.restore();
    fakeGet.restore();
  });

  it('returns 400 for no query', () => {
    chai.request(app).get('/api/search').end((e, resp) => {
      resp.error.text.should.be.a('string');
      resp.error.text.should.equal('No search query');
      resp.error.status.should.equal(400);
    });
  });

  it('calls the GB API only once', () => {
    //const fakeGet = sinon.spy(axios, 'all');
    const cl = sinon.spy(console, 'log');
    chai.request(app).get('/api/search?searchTerm=Mario').end((e, resp) => {
      //expect(fakeGet.calledOnce).to.equal(true);
      console.log(cl.lastCall, 'lastcall');
      expect(cl.callCount).to.equal(3);
    });
  });
  
});