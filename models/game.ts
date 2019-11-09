import {Model, Table, Column, AllowNull, HasMany, BelongsToMany, DataType, Default} from 'sequelize-typescript';
import {Rating} from './Rating';
import {Platform, PlatformProps} from './Platform';
import {GamePlatform} from './GamePlatform';
import {Entry} from './Entry';

export interface GameProps {
    custom: boolean;
    apiDetailUrl: string;
    deck: string;
    description: string;
    developers: Array<string>;
    expectedReleaseDay: number;
    expectedReleaseMonth: number;
    expectedReleaseYear: number;
    franchises: Array<any>;
    genres: Array<any>;
    gbId: number | null;
    image: string;
    name: string;
    platforms?: PlatformProps[];
    releases: Array<any>;
    siteDetailUrl: string | null;
}

@Table
export class Game extends Model implements GameProps {

  // ---------------------------
  // class data
  // ---------------------------

  @Default(false)
  @Column
  public custom!: boolean;

  @Column
  public apiDetailUrl!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
  public deck!: string;

  @AllowNull(false)
  @Column(DataType.TEXT)
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
