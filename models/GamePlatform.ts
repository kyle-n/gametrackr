import { Model, ForeignKey, Column, Table } from 'sequelize-typescript';
import { Game } from './Game';
import { Platform } from './Platform';

@Table
export class GamePlatform extends Model {

  @ForeignKey(() => Game)
  @Column
  public gameId!: number;

  @ForeignKey(() => Platform)
  @Column
  public platformId!: number;

}