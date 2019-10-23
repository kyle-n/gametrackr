'use strict';

import {Sequelize} from 'sequelize-typescript';

import {User} from '../models/User';
import {Game} from '../models/Game';
import {List} from '../models/List';
import {Entry} from '../models/Entry';
import {Rating} from '../models/Rating';
import {Platform} from '../models/Platform';
import {GamePlatform} from '../models/GamePlatform';

export const sequelize = new Sequelize({
  database: <string>process.env.PSQL_DB_NAME,
  username: <string>process.env.PSQL_USERNAME,
  password: process.env.PSQL_PASSWORD,
  host: 'localhost',
  dialect: 'postgres',
  models: [GamePlatform, Game, Platform, Entry, List, Rating, User]
});

export {User, UserProps} from '../models/User';
export {Game, GameProps} from '../models/Game';
export {List, ListProps} from '../models/List';
export {Entry, EntryProps} from '../models/Entry';
export {Rating, RatingProps} from '../models/Rating';
export {Platform, PlatformProps} from '../models/Platform';
export {GamePlatform} from '../models/GamePlatform';
