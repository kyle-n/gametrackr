import {Model, Table, Column, HasMany, Unique, AllowNull} from 'sequelize-typescript';
import {List} from './List';
import {Rating} from './Rating';
import {PublicEntity, PublicData} from './PublicInterfaces';

interface PublicUserData extends PublicData {
  name: string;
  email?: string;
}

export interface UserProps {
  name: string;
  password: string;
  email: string;
  confirmed: boolean;
}

@Table
export class User extends Model<User> implements PublicEntity, UserProps {

  // ---------------------------
  // class data
  // ---------------------------

  @Unique
  @Column
  public name!: string;

  @AllowNull(false)
  @Column
  public password!: string;

  @Unique
  @Column
  public email!: string;

  @Column
  public confirmed!: boolean;

  public getPublicData(returnEmail?: boolean): PublicUserData {
    const publicData: PublicUserData = {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt
    };
    if (returnEmail) publicData.email = this.email;
    return publicData;
  }

  // ---------------------------
  // exterior relations
  // ---------------------------

  @HasMany(() => List, 'userId')
  public lists!: Array<List>;

  @HasMany(() => Rating, 'userId')
  public ratings!: Array<Rating>;

}
