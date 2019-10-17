import {Sequelize} from 'sequelize-typescript';

export async function initializeDatabase(): Promise<Sequelize> {
  const sequelize = new Sequelize({
    database: <string>process.env.PSQL_DB_NAME,
    username: <string>process.env.PSQL_USERNAME,
    password: process.env.PSQL_PASSWORD,
    host: 'localhost',
    dialect: 'postgres',
    models: [__dirname + '/models']
  });

  await sequelize.authenticate();

  return sequelize;
};
