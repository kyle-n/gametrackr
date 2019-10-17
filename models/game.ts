import {Model} from 'sequelize';

export class Game extends Model {
  public id: number;
  public name: string;
  public imageUrl: string;
  public deck: string;
  public description: string;
  public platforms: Array<string>;
  public releaseDate: Date;
}
