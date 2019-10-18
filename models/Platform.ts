import { Model, Table, AllowNull, Column, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { Game } from './Game';
import { GamePlatform } from './GamePlatform';

@Table
export class Platform extends Model {

  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public deck!: string;

  @BelongsToMany(() => Game, () => GamePlatform)
  public games!: Array<Game>;

}