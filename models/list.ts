import {Model, Table, Column, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Entry} from './Entry';
import {User} from './User';

@Table
export class List extends Model {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public title!: string;

  @Column
  public deck!: string;

  // ---------------------------
  // exterior relations
  // ---------------------------

  @HasMany(() => Entry, 'listId')
  public entries!: Array<Entry>;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
