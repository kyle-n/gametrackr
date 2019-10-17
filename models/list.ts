import { Model, Table, Column } from 'sequelize-typescript';

@Table
export class List extends Model {

  @Column
  public title!: string;

  @Column
  public deck!: string;

  @Column
  public entries!: Array<number>;

}
