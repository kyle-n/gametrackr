import {GiantBombGame, PlatformStrategized, GiantBombPlatform} from './interfaces';
import {Platform, GameProps, PlatformProps} from '../../models';

export const mapGbGame = (game: GiantBombGame): GameProps => {
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

export const mapStrategizedGbPlatform = (platform: PlatformStrategized): PlatformProps => {
  return {
    abbreviation: platform.abbreviation,
    apiDetailUrl: platform.api_detail_url,
    gbId: platform.id,
    name: platform.name,
    siteDetailUrl: platform.site_detail_url,
  }
};

export const mapGbPlatform = (platform: GiantBombPlatform): PlatformProps => {
  const mappedPlatform = mapStrategizedGbPlatform(platform);
  mappedPlatform.company = platform.company;
  mappedPlatform.deck = platform.deck;
  mappedPlatform.description = platform.description;
  mappedPlatform.image = platform.image.original_url;
  mappedPlatform.installBase = platform.install_base;
  mappedPlatform.originalPrice = platform.original_price;
  mappedPlatform.releaseDate = new Date(platform.release_date);
  return mappedPlatform;
};
