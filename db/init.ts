import pgp from 'pg-promise';
export const connection = `postgres://${process.env.PSQL_USERNAME}:${process.env.PSQL_PASSWORD}@localhost:5432/gametrackr`;

const database = pgp();
export const client = database(connection);

export default function initialize() {

  client.query(`CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY, 
      email TEXT UNIQUE NOT NULL, 
      password TEXT NOT NULL, 
      confirmed BOOL DEFAULT false
      );`
  ).then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS list_metadata(
      id SERIAL PRIMARY KEY,
      user_id INTEGER,
      title TEXT,
      deck TEXT,
      private BOOL DEFAULT true
      );`)
  }).then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS list_entries(
      id SERIAL PRIMARY KEY,
      ranking INTEGER,
      list_id INTEGER NOT NULL,
      game_id INTEGER NOT NULL
    );`)
  }).then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS games(
      aliases TEXT,
      api_detail_url TEXT,
      deck TEXT,
      description TEXT,
      expected_release_day TEXT,
      expected_release_month TEXT,
      expected_release_year TEXT,
      guid TEXT NOT NULL,
      id INTEGER,
      name TEXT,
      original_release_date TEXT,
      site_detail_url TEXT,
      resource_type TEXT,
      platforms INTEGER[]
    );`)
  }).then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS game_images(
      game_id INTEGER NOT NULL UNIQUE,
      icon_url TEXT,
      medium_url TEXT,
      screen_url TEXT,
      screen_large_url TEXT,
      small_url TEXT,
      super_url TEXT,
      thumb_url TEXT,
      tiny_url TEXT,
      original_url TEXT
    );`);
  }).then(() => {
    return client.query(`CREATE TABLE IF NOT EXISTS platforms(
      id INTEGER NOT NULL UNIQUE,
      api_detail_url TEXT,
      name TEXT,
      site_detail_url TEXT,
      abbreviation TEXT
    );`);
  }).then(() => {
    console.log('Database initialized');
  }).catch(e => console.log(e));

}