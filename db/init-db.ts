import {Sequelize} from 'sequelize-typescript';
import {User} from '../models/user';
import {Game} from '../models/game';
import {List} from '../models/list';
import {Entry} from '../models/entry';
import {Rating} from '../models/rating';
import {Platform} from '../models/platform';
import {GamePlatform} from '../models/gameplatform';

export async function initializeDatabase(): Promise<Sequelize> {
  const sequelize = new Sequelize({
    database: <string>process.env.PSQL_DB_NAME,
    username: <string>process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    host: 'localhost',
    dialect: 'postgres',
    models: [GamePlatform, Game, Platform, Entry, List, Rating, User]
  });

  await sequelize.authenticate();
  await sequelize.sync();

  return sequelize;
};
