import {Model, Table, Column, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Entry} from './Entry';
import {User} from './user';

@Table
export class List extends Model {

  @Column
  public title!: string;

  @Column
  public deck!: string;

  @HasMany(() => Entry, 'listId')
  public entries!: Array<Entry>;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
