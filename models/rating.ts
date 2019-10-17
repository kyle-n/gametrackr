import {Model} from 'sequelize';

export class Rating extends Model {
  public id: number;
  public gameId: number;
  public rating: number;
  public userId: number;
}
