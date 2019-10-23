import {Model, Table, AllowNull, Column, BelongsTo, BelongsToMany, Unique} from 'sequelize-typescript';
import {Game} from './Game';
import {GamePlatform} from './GamePlatform';

export interface PlatformProps {
    abbreviation: string;
    apiDetailUrl: string;
    company?: string;
    deck?: string;
    description?: string;
    gbId: number;
    image?: string;
    installBase?: number;
    name: string;
    originalPrice?: number;
    releaseDate?: Date;
    siteDetailUrl: string;
}

@Table
export class Platform extends Model implements PlatformProps {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public abbreviation!: string;

  @Column
  public apiDetailUrl!: string;

  @Column
  public company!: string;

  @Column
  public deck!: string;

  @Column
  public description!: string;

  @Unique
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