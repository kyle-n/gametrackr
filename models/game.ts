import {Model, Table, Column, NotNull, HasMany} from 'sequelize-typescript';
import { Rating } from './rating';

@Table
export class Game extends Model {

  @Column
  @NotNull
  public name!: string;

  @Column
  @NotNull
  public imageUrl!: string;

  @Column
  @NotNull
  public deck!: string;

  @Column
  @NotNull
  public description!: string;

  @Column
  @NotNull
  public platforms!: Array<string>;

  @Column
  @NotNull
  public releaseDate!: Date;

  @HasMany(() => Rating)
  public ratings!: Array<Rating>;

}
