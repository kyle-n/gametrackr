import {Model, Table, Column, AllowNull, HasMany, ForeignKey, BelongsToMany, BelongsTo} from 'sequelize-typescript';
import { Rating } from './rating';
import { Platform } from './Platform';
import { GamePlatform } from './GamePlatform';
import { Entry } from './Entry';
import { List } from './list';

@Table
export class Game extends Model {

  // class attributes
  @AllowNull(false)
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public imageUrl!: string;

  @AllowNull(false)
  @Column
  public deck!: string;

  @AllowNull(false)
  @Column
  public description!: string;

  @AllowNull(false)
  @Column
  public releaseDate!: Date;

  // exterior relations
  @BelongsToMany(() => Platform, () => GamePlatform)
  public platforms!: Array<Platform>;

  @HasMany(() => Rating, 'gameId')
  public ratings!: Array<Rating>;

  @HasMany(() => Entry, 'gameId')
  public entries!: Array<Entry>;

}
