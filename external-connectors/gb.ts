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
    developers: game.developers || null,
    expectedReleaseDay: game.expected_release_day,
    expectedReleaseMonth: game.expected_release_month,
    expectedReleaseYear: game.expected_release_year,
    franchises: game.franchises || null,
    genres: game.genres || null,
    gbId: game.id,
    image: game.image.medium_url || '',
    name: game.name,
    releases: game.releases || null,
    siteDetailUrl: game.site_detail_url,
  };
}

const upsertGames = async (games: Array<GiantBombGame>): Promise<void> => {
  const mappedGames: Array<any> = games.map(mapGbGame);
  await Game.bulkCreate(mappedGames, {updateOnDuplicate: [
    'apiDetailUrl', 'deck', 'description', 'expectedReleaseDay', 'expectedReleaseMonth',
    'expectedReleaseYear', 'image', 'name', 'siteDetailUrl'
  ]});
};

const search = async (query: string): Promise<GiantBombResponse> => {
  const url: string = baseUrl + '/search?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    `query=${encodeURI(query)}`,
    'format=json',
    'resources=game'
  ].join('&');
  const gbResp: GiantBombResponse = <any>(await axios.get(url, {headers: [{accept: 'application/json'}], data: {}})).data;

  // do not wait for database caching to return results to the user
  upsertGames(gbResp.results);

  return gbResp;
};

export const GbConnector: GiantBombConnector = {search};
