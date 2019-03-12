/* --------------------------------------------
   Class notes:
   * Each test cleans up after itself because
     afterEach() runs synchronously. 
   * IceKingJson is a sample response saved
     from the GB API.
   * All test object IDs are negative
   -------------------------------------------- */

import { app } from '../../server';
import { saveGames, savePlatforms } from '../search';
import { describe, it, beforeEach } from 'mocha';
import { expect } from 'chai';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { client } from '../../db';
import sinon from 'sinon';
import axios from 'axios';
import moxios from 'moxios';
import IceKingJson from '../../schemas/iceking.json';
import { ServerError, GiantBombGame, GiantBombPlatform } from '../../schemas';
import { rInt } from '../../utils';

// config
chai.use(chaiHttp);
const should = chai.should();
const defaultError: ServerError = { status: 500, msg: 'Database error' };
let token: string;

describe('Router search interface', () => {

  // give system time to initialize db
  before(done => {
    setTimeout(() => {
      chai.request(app).post('/api/external').send({ email: 'test@test.com', password: 'abc123' }).then(resp => {
        if (resp.error && resp.error.text) console.log(resp.error.text);
        token = 'jwt ' + resp.body.token;
        console.log('test token', token);
        return done();
      });
    }, 500);
  });

  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    return new Promise((resolve, reject) => {
      client.query('DELETE FROM games WHERE id < 0;').then(() => {
        return client.query('DELETE FROM platforms WHERE id < 0;');
      }).then(() => {
        return client.query('DELETE FROM game_images WHERE game_id < 0;');
      }).then(() => resolve()).catch(e => { console.log(e); reject(); });
    });
  });

  it('returns 400 for no query', () => {
    return new Promise<void>((resolve, reject) => {
      chai.request(app).get('/api/search').set('authorization', token).then(resp => {
        resp.error.text.should.be.a('string');
        resp.error.text.should.equal('No search query');
        resp.error.status.should.equal(400);
        return resolve();
      }).catch(e => {
        console.log(e);
        reject();
      });
    });
  });

  it('calls the GB API only once', done => {
    moxios.stubRequest(/giantbomb\.com/g, {
      response: IceKingJson.data,
      status: IceKingJson.status,
      headers: IceKingJson.headers
    });
    const getSpy = sinon.spy(axios, 'get');
    chai.request(app).get('/api/search?searchTerm=target_terror').set('authorization', token).then((resp: any) => {
      expect(getSpy.calledOnce).to.equal(true);
      setTimeout(done, 1000);
    });
  }).timeout(3000);

  it('runs saveGames() synchronously without crashing and saves correctly', done => {
    const resultCode = saveGames(defaultError, IceKingJson);
    expect(resultCode).to.equal(0);
    // pause to let inserts finish
    setTimeout(() => {
      client.query('SELECT * FROM games WHERE id < 0;').then(rows => {
        expect(rows.length).to.equal(IceKingJson.data.results.length);
        const heyIceKing: GiantBombGame = rows.find((r: GiantBombGame) => r.id === -37763);
        const ikComparison: any = IceKingJson.data.results.find((r: any) => r.id === -37763);
        expect(heyIceKing.deck).to.equal(ikComparison.deck);
        expect(heyIceKing.name).to.equal(ikComparison.name);
        expect(heyIceKing.resource_type).to.equal(ikComparison.resource_type);
        done();
      });
    }, 1000);
  }).timeout(3000);

  it('runs savePlatforms() synchronously without crashing and saves correctly', done => {
    moxios.stubRequest(/giantbomb\.com/g, {
      response: IceKingJson.data,
      status: IceKingJson.status,
      headers: IceKingJson.headers
    });
    const resultCode: number = savePlatforms(defaultError, IceKingJson);
    expect(resultCode).to.equal(0);
    setTimeout(() => {
      client.query('SELECT * FROM platforms WHERE id < 0;').then(rows => {
        expect(rows.length).to.equal(16);
        expect(rows[rInt(rows.length)]).to.haveOwnProperty('api_detail_url');
        expect(rows[rInt(rows.length)]).to.haveOwnProperty('id');
        expect(rows[rInt(rows.length)]).to.haveOwnProperty('name');
        expect(rows[rInt(rows.length)]).to.haveOwnProperty('site_detail_url');
        expect(rows[rInt(rows.length)]).to.haveOwnProperty('abbreviation');
        const ds: GiantBombPlatform = rows.find((r: GiantBombPlatform) => r.id === -52);
        expect(ds.name).to.equal('Nintendo DS');

        done();
      });
    }, 1000);
  }).timeout(3000);

});