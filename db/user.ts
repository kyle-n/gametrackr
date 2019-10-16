import {Model, DataTypes} from 'sequelize';

export class User extends Model {
  public id: number;
  public username: string;
  public password: string;
  public email: string;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: new DataTypes.STRING(32),
    allowNull: false
  },
  password: {
    type: new DataTypes.STRING(256),
    allowNull: false
  },
  email: {
    type: new DataTypes.STRING(),
    allowNull: false
  }
}, {
  tableName: 'users',
  sequelize: null
});
