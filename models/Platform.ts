import {Model, Table, AllowNull, Column, BelongsTo, BelongsToMany} from 'sequelize-typescript';
import {Game} from './Game';
import {GamePlatform} from './GamePlatform';

@Table
export class Platform extends Model {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public abbreviation!: string;

  @Column
  public company!: string;

  @Column
  public deck!: string;

  @Column
  public description!: string;

  @Column
  public gbId!: number;

  @Column
  public image!: string;

  @Column
  public installBase!: number;

  @Column
  public name!: string;

  @Column
  public originalPrice!: number;

  @Column
  public releaseDate!: Date;

  @Column
  public siteDetailUrl!: string;

  // ---------------------------
  // exterior relations
  // ---------------------------

  @BelongsToMany(() => Game, () => GamePlatform)
  public games!: Array<Game>;

}