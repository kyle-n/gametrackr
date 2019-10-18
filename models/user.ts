import {Model, Table, Column, HasMany, DataType, Sequelize, AllowNull, Unique, NotNull} from 'sequelize-typescript';
import {List} from './list';
import {Rating} from './rating';

@Table
export class User extends Model<User> {

  // ---------------------------
  // class data
  // ---------------------------

  @Unique
  @Column
  public username!: string;

  @AllowNull(false)
  @Column
  public password!: string;

  @Unique
  @Column
  public email!: string;

  // ---------------------------
  // exterior relations
  // ---------------------------

  @HasMany(() => List, 'userId')
  public lists!: Array<List>;

  @HasMany(() => Rating, 'userId')
  public ratings!: Array<Rating>;
}
