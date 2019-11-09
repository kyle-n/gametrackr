import axios from 'axios';
import {Game, GameProps, Platform, PlatformProps} from '../../models';

import {GiantBombConnector, GiantBombGame, GiantBombResponse} from './interfaces';
import {mapGbGame, mapStrategizedGbPlatform} from './mappings';

const baseUrl = 'https://www.giantbomb.com/api';

const upsertGames = async (mappedGames: Array<GameProps>): Promise<void> => {
  await Game.bulkCreate(mappedGames, {updateOnDuplicate: [
    'apiDetailUrl', 'deck', 'description', 'expectedReleaseDay', 'expectedReleaseMonth',
    'expectedReleaseYear', 'image', 'name', 'siteDetailUrl'
  ]});
};

const upsertStrategizedPlatforms = async (mappedPlatforms: Array<PlatformProps>): Promise<void> => {
  await Platform.bulkCreate(mappedPlatforms, {updateOnDuplicate: [
    'siteDetailUrl'
  ]});
};

const upsertGamesAndPlatforms = (results: GiantBombGame[]): GameProps[] => {
  const gamesToUpsert: GameProps[] = [];
  const platformsToUpsert: PlatformProps[] = [];
  const previousPlatformIds: number[] = [];
  results.forEach(result => {
    const mappedGame = mapGbGame(result);
    gamesToUpsert.push(mappedGame);
    if (result.platforms) {
      mappedGame.platforms = result.platforms.map(platform => {
        const mappedPlatform = mapStrategizedGbPlatform(platform);
        if (!previousPlatformIds.includes(platform.id)) {
          previousPlatformIds.push(platform.id);
          platformsToUpsert.push(mappedPlatform);
        }
        return mappedPlatform;
      });
    }
  });

  upsertGames(gamesToUpsert)
  upsertStrategizedPlatforms(platformsToUpsert);

  return gamesToUpsert;
}

const search = async (query: string): Promise<GiantBombResponse> => {
  const url: string = baseUrl + '/search?' + [
    `api_key=${process.env.GIANT_BOMB_API_KEY}`,
    `query=${encodeURI(query)}`,
    'format=json',
    'resources=game'
  ].join('&');
  const gbResp: GiantBombResponse = <any>(await axios.get(url, {headers: [{accept: 'application/json'}], data: {}})).data;
  console.log(gbResp.status_code, gbResp.number_of_total_results, 'results');

  // do not wait for database caching to return results to the user
  gbResp.games = upsertGamesAndPlatforms(gbResp.results);
  gbResp.results = [];

  return gbResp;
};

export const GbConnector: GiantBombConnector = {search};
