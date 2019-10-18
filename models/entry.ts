import {Model, Table, Column, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Game} from './Game';
import {List} from './list';
import { User } from './user';

@Table
export class Entry extends Model {

  @Column
  public caption!: string;

  @ForeignKey(() => Game)
  @Column
  public gameId!: number;

  @BelongsTo(() => Game, 'gameId')
  public game!: Game;

  @ForeignKey(() => List)
  @Column
  public listId!: number;

  @BelongsTo(() => List, 'listId')
  public list!: List;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
