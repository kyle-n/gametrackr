import axios from 'axios';
import {Game} from '../models';
import {GiantBombConnector, GiantBombGame, GiantBombResponse, PlatformStrategized, ImageStrategized} from './gb-interfaces';

const baseUrl = 'https://www.giantbomb.com/api';

const mapGbGame = (game: GiantBombGame): any => {
  return {
    custom: false,
    apiDetailUrl: game.api_detail_url || '',
    deck: game.deck || '',
    description: game.description || '',
    developers: game.developers || [],
    expectedReleaseDay: game.expected_release_day,
    expectedReleaseMonth: game.expected_release_month,
    expectedReleaseYear: game.expected_release_year,
    franchises: game.franchises || [],
    genres: game.genres || [],
    gbId: game.id,
    image: game.image.medium_url || '',
    name: game.name,
    releases: game.releases || [],
    siteDetailUrl: game.site_detail_url,
    platforms: [],
    ratings: [],
    entries: []
  };
}

const upsertGames = async (games: Array<GiantBombGame>): Promise<void> => {
  const mappedGames: Array<any> = games.map(mapGbGame);
  await Game.bulkCreate(mappedGames, {updateOnDuplicate: undefined});
};

const search = async (query: string): Promise<GiantBombResponse> => {
  const url: string = baseUrl + '/search?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    `query=${encodeURI(query)}`,
    'format=json',
    'resources=game'
  ].join('&');
  const gbResp: GiantBombResponse = <any>(await axios.get(url, {headers: [{accept: 'application/json'}], data: {}})).data;

  return gbResp;
};

export const GbConnector: GiantBombConnector = {search};
