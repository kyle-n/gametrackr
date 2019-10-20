import {Model, Table, Column, AllowNull, HasMany, BelongsToMany, DataType, Default, Unique} from 'sequelize-typescript';
import {Rating} from './Rating';
import {Platform} from './Platform';
import {GamePlatform} from './GamePlatform';
import {Entry} from './Entry';

@Table
export class Game extends Model {

  // ---------------------------
  // class data
  // ---------------------------

  @Default(false)
  @Column
  public custom!: boolean;

  @Column
  public apiDetailUrl!: string;

  @AllowNull(false)
  @Column
  public deck!: string;

  @AllowNull(false)
  @Column
  public description!: string;

  @Column(DataType.STRING)
  public developers!: Array<string>;

  @Column
  public expectedReleaseDay!: number;

  @Column
  public expectedReleaseMonth!: number;

  @Column
  public expectedReleaseYear!: number;

  @Column(DataType.STRING)
  public franchises!: Array<string>;

  @Column(DataType.STRING)
  public genres!: Array<string>;

  @AllowNull(false)
  @Unique
  @Column
  public gbId!: number;

  @Column
  public image!: string;

  @AllowNull(false)
  @Column
  public name!: string;

  @Column(DataType.STRING)
  public releases!: Array<Date>;

  @Column
  public siteDetailUrl!: string;

  // ---------------------------
  // exterior relations
  // ---------------------------

  @BelongsToMany(() => Platform, () => GamePlatform)
  public platforms!: Array<Platform>;

  @HasMany(() => Rating, 'gameId')
  public ratings!: Array<Rating>;

  @HasMany(() => Entry, 'gameId')
  public entries!: Array<Entry>;

}
