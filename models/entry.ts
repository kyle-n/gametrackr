import {Model, Table, Column, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Game} from './Game';
import {List} from './List';
import {User} from './User';

@Table
export class Entry extends Model {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public caption!: string;

  // ---------------------------
  // exterior relations
  // ---------------------------

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
