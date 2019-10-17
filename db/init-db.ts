import {Observable, from, of} from 'rxjs';
import {Sequelize} from 'sequelize';

export function initializeDatabase(): Observable<Sequelize> {
  const sequelize = new Sequelize(<string>process.env.PSQL_DB_NAME, <string>process.env.PSQL_USERNAME, process.env.PSQL_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
  });

  const authTest: Observable<void> = from(sequelize.authenticate());

  return of(sequelize);
};
