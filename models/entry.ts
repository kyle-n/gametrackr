import {Model} from 'sequelize';

export class Entry extends Model {
  public id: number;
  public gameId: number;
  public caption: string;
  public listId: number;
}
