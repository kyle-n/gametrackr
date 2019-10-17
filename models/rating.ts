import {Model, Table, Column, BelongsTo} from 'sequelize-typescript';
import { User } from './user';

@Table
export class Rating extends Model {

  @Column
  public rating!: number;

}
