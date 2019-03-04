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
  original_release_date: string;
  site_detail_url: string;
  resource_type: string;
  platforms: GiantBombPlatform[];
}

export interface GiantBombPlatform {
  id: number;
  api_detail_url: string;
  name: string;
  site_detail_url: string;
  abbreviation: string;
}