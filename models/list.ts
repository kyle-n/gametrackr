import {Model} from 'sequelize';

export class List extends Model {
  public id!: number;
  public title!: string;
  public deck!: string;
  public entries!: Array<number>;
}
