import {Model, Table, Column, HasMany, DataType, Sequelize} from 'sequelize-typescript';

@Table
export class User extends Model<User> {

  @Column
  public username!: string;

  @Column
  public password!: string;

  @Column
  public email!: string;
}

User.init({
  username: {
    type: new DataType.STRING(32),
    allowNull: false
  },
  password: {
    type: new DataType.STRING(256),
    allowNull: false
  },
  email: {
    type: new DataType.STRING(),
    allowNull: false
  }
}, {
  tableName: 'users',
  sequelize: new Sequelize()
});
