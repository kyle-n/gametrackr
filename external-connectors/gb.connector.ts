import axios from 'axios';
import {Game, Platform} from '../models';

import {GiantBombConnector, GiantBombGame, GiantBombResponse, PlatformStrategized, ImageStrategized} from './gb.interfaces';
import {mapGbGame, mapStrategizedGbPlatform} from './gb.mappings';

const baseUrl = 'https://www.giantbomb.com/api';

const upsertGames = async (games: Array<GiantBombGame>): Promise<void> => {
  const mappedGames: Array<any> = games.map(mapGbGame);
  await Game.bulkCreate(mappedGames, {updateOnDuplicate: [
    'apiDetailUrl', 'deck', 'description', 'expectedReleaseDay', 'expectedReleaseMonth',
    'expectedReleaseYear', 'image', 'name', 'siteDetailUrl'
  ]});
};

const upsertStrategizedPlatforms = async (platforms: Array<PlatformStrategized>): Promise<void> => {
  const mappedPlatforms: Array<any> = platforms.map(mapStrategizedGbPlatform);
  await Platform.bulkCreate(mappedPlatforms, {updateOnDuplicate: [
    'siteDetailUrl'
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
  const addedPlatforms: Array<number> = [];
  const platformsToUpsert: Array<PlatformStrategized> = gbResp.results
    .reduce((allPlatforms: Array<PlatformStrategized>, game: GiantBombGame) => {
      const platformsToConcat: Array<PlatformStrategized> = game.platforms
        .filter((platform: PlatformStrategized) => !addedPlatforms.includes(platform.id));
      return allPlatforms.concat(platformsToConcat);
    }, []);
  upsertStrategizedPlatforms(platformsToUpsert);

  return gbResp;
};

export const GbConnector: GiantBombConnector = {search};
