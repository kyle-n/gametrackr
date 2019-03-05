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
import moxios from 'moxios';
import IceKingJson from '../../schemas/iceking.json';
import { ServerError } from '../../schemas';

chai.use(chaiHttp);
const should = chai.should();
const client: Client = new Client(connectionUrl);
client.connect();
const defaultError: ServerError = { status: 500, msg: 'Database error' };

describe('Client router interface', () => {

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('returns 400 for no query', done => {
    setTimeout(() => {
      chai.request(app).get('/api/search').then((resp) => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('No search query');
        resp.error.status.should.equal(400);
        done();
      });
    }, 500);
  });

  it('calls the GB API only once', done => {
    console.log('starting second call');
    moxios.stubRequest(/giantbomb.com/g, {
      response: IceKingJson.data,
      status: IceKingJson.status,
      headers: IceKingJson.headers
    });
    const getSpy = sinon.spy(axios, 'get');
    chai.request(app).get('/api/search?searchTerm=Mario').then((resp: any) => {
      expect(getSpy.calledOnce).to.equal(true);
      return client.query('DELETE FROM games WHERE id < 0');
    }).then(() => done());
  });

  it('runs saveGames() without crashing and saves games correctly', done => {
    //client.query('DELETE FROM games WHERE id < 0 RETURNING (id, name, deck);').then(deleted => {
      let resultCode = saveGames(defaultError, IceKingJson);
      expect(resultCode).to.equal(0);
      setTimeout(() => {
        client.query('SELECT * FROM games WHERE id < 0;').then(data => {
          expect(data.rowCount).to.equal(IceKingJson.data.results.length);
          return client.query('')
        });
      }, 1000);
    //});
  }).timeout(3000);

});