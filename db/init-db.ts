import {Sequelize} from 'sequelize';

export async function initializeDatabase(): Promise<Sequelize> {
  const sequelize = new Sequelize(<string>process.env.PSQL_DB_NAME, <string>process.env.PSQL_USERNAME, process.env.PSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
  });

  await sequelize.authenticate();

  return sequelize;
};
