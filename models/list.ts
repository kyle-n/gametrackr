import {Model, Table, Column, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Entry} from './Entry';
import {User} from './User';
import {PublicEntity, PublicData} from './PublicInterfaces';

interface PublicListData extends PublicData {
  title: string;
  updatedAt: string;
  userName: string;
}

@Table
export class List extends Model<List> implements PublicEntity {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public title!: string;

  @Column
  public deck!: string;

  public getPublicData(): PublicListData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      title: this.title,
      updatedAt: this.updatedAt,
      userName: this.user.name
    };
  }

  // ---------------------------
  // exterior relations
  // ---------------------------

  @HasMany(() => Entry, 'listId')
  public entries!: Array<Entry>;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
