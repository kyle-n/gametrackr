import {Model, Table, Column, HasMany, Unique, AllowNull} from 'sequelize-typescript';
import {List} from './List';
import {Rating} from './Rating';

@Table
export class User extends Model<User> {

  // ---------------------------
  // class data
  // ---------------------------

  @Unique
  @Column
  public name!: string;

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
