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
import { ServerError, GiantBombGame } from '../../schemas';

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
    // pause to give system time to initialize db
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
    moxios.stubRequest(/giantbomb.com/g, {
      response: IceKingJson.data,
      status: IceKingJson.status,
      headers: IceKingJson.headers
    });
    const getSpy = sinon.spy(axios, 'get');
    chai.request(app).get('/api/search?searchTerm=target_terror').then((resp: any) => {
      expect(getSpy.calledOnce).to.equal(true);
      setTimeout(() => {
        client.query('DELETE FROM games WHERE id < 0;').then(() => done());
      }, 1000);
    });
  }).timeout(3000);

  it('runs saveGames() synchronously without crashing and saves correctly', done => {
    let resultCode = saveGames(defaultError, IceKingJson);
    expect(resultCode).to.equal(0);
    // pause to let inserts finish
    setTimeout(() => {
      client.query('SELECT * FROM games WHERE id < 0;').then(data => {
        expect(data.rowCount).to.equal(IceKingJson.data.results.length);
        const heyIceKing: GiantBombGame = data.rows.find(r => r.id === -37763);
        const ikComparison: any = IceKingJson.data.results.find(r => r.id === -37763);
        expect(heyIceKing.deck).to.equal(ikComparison.deck);
        expect(heyIceKing.name).to.equal(ikComparison.name);
        expect(heyIceKing.resource_type).to.equal(ikComparison.resource_type);
        return client.query('DELETE FROM games WHERE id < 0;');
      }).then(() => done());
    }, 1000);
  }).timeout(3000);

});