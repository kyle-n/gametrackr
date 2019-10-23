import {Model, Table, Column, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {User} from './User';
import {Game} from './Game';

export interface RatingProps {
  rating: number;
  gameId: number;
  userId: number;
}

@Table
export class Rating extends Model implements RatingProps {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public rating!: number;

  // ---------------------------
  // exterior relations
  // ---------------------------

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
