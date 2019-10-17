import {Model, Table, Column, HasMany, DataType, Sequelize, AllowNull, Unique} from 'sequelize-typescript';
import { List } from './list';
import { Rating } from './rating';

@Table
export class User extends Model<User> {

  @Column
  @AllowNull(false)
  @Unique
  public username!: string;

  @Column
  @AllowNull(false)
  public password!: string;

  @Column
  @AllowNull(false)
  @Unique
  public email!: string;

  @HasMany(() => List)
  public lists!: List[];

  @HasMany(() => Rating)
  public ratings!: Rating[];
}
