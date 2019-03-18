export interface GiantBombGame extends Array<any> {
  aliases: string;
  api_detail_url: string;
  deck: string;
  description: string;
  expected_release_day: string;
  expected_release_month: string;
  expected_release_year: string;
  guid: string;
  id: number;
  name: string;
  image: string;
  original_release_date: string;
  site_detail_url: string;
  resource_type: string;
  platforms: GiantBombPlatform[];
  owner_id: number;
}

export interface GiantBombPlatform {
  id: number;
  api_detail_url: string;
  name: string;
  site_detail_url: string;
  abbreviation: string;
}

export interface CustomGame {
  id: number;
  user_id: number;
}

export interface ServerError {
  status: number;
  msg: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  confirmed: boolean;
}

export interface List {
  id: number;
  title: string;
  deck: string;
  entries: ListEntry[];
  private: boolean;
}

export interface ListEntry {
  id: number;
  game_id: number;
  list_id: number;
  ranking: number;
  text: string;
}

export interface DecodedToken {
  id: number;
  email: string;
}

export interface Review {
  id: number;
  game_id: number;
  user_id: number;
  stars: number;
}
