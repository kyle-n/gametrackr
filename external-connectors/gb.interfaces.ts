import {Game, GameProps} from '../models';

export interface GiantBombConnector {
  search: (query: string) => Promise<GiantBombResponse>;
  // getGameDetails: () => Promise<Game>;
}

export interface PlatformStrategized {
  abbreviation: string;
  api_detail_url: string;
  id: number;
  name: string;
  site_detail_url: string;
}

export interface GiantBombPlatform extends PlatformStrategized {
  company: string;
  deck: string;
  description: string;
  image: ImageStrategized;
  install_base: number;
  original_price: number;
  release_date: string;
}

export interface ImageStrategized {
  icon_url: string;
  medium_url: string;
  screen_url: string;
  screen_large_url: string;
  small_url: string;
  super_url: string;
  thumb_url: string;
  tiny_url: string;
  original_url: string;
  image_tags: string;
}

export interface GiantBombGame {
  aliases: string;
  api_detail_url: string;
  characters: any;
  date_added: string;
  date_last_updated: string;
  deck: string;
  description: string;
  developers: any;
  expected_release_day: number;
  expected_release_month: number;
  expected_release_quarter: number;
  expected_release_year: number;
  franchises: any;
  genres: any;
  guid: string;
  id: number;
  image: ImageStrategized;
  image_tags: Array<{api_detail_url: string; name: string; total: number}>;
  killed_characters: any;
  locations: any;
  name: string;
  original_release_date: string;
  platforms: Array<PlatformStrategized>;
  publishers: any;
  releases: any;
  resource_type: 'game' | 'franchise';
  similar_games: any;
  site_detail_url: string;
}

export interface GiantBombResponse {
  status_code: number;
  error: string;
  number_of_total_results: number;
  number_of_page_results: number;
  limit: number;
  offset: number;
  results: Array<GiantBombGame>;
  games?: Array<GameProps>;
}