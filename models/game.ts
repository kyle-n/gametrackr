import {Model, Table, Column, AllowNull, HasMany, BelongsToMany} from 'sequelize-typescript';
import {Rating} from './rating';
import {Platform} from './Platform';
import {GamePlatform} from './GamePlatform';
import {Entry} from './Entry';

@Table
export class Game extends Model {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public apiDetailUrl!: string;

  @AllowNull(false)
  @Column
  public deck!: string;

  @AllowNull(false)
  @Column
  public description!: string;

  @Column
  public developers!: Array<string>;

  @Column
  public expectedReleaseDay!: string;

  @Column
  public expectedReleaseMonth!: string;

  @Column
  public expectedReleaseYear!: string;

  @Column
  public franchises!: Array<string>;

  @Column
  public genres!: Array<string>;

  @AllowNull(false)
  @Column
  public gbId!: number;

  @Column
  public image!: string;

  @AllowNull(false)
  @Column
  public name!: string;

  @Column
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
