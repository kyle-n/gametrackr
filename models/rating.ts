import {Model, Table, Column, BelongsTo, ForeignKey} from 'sequelize-typescript';
import { User } from './user';
import { Game } from './Game';

@Table
export class Rating extends Model {

  @Column
  public rating!: number;

  @ForeignKey(() => Game)
  @Column
  public gameId!: number;

  @BelongsTo(() => Game, 'gameId')
  public game!: Game;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
