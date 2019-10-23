import {Model, Table, Column, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Entry} from './Entry';
import {User} from './User';
import {PublicEntity, PublicData} from './PublicInterfaces';
import {DataTypes} from 'sequelize';

interface PublicListData extends PublicData {
  title: string;
  updatedAt: string;
  entryIds: number[];
}

export interface ListProps {
  title: string;
  deck: string;
  userId: number;
}

@Table
export class List extends Model<List> implements PublicEntity, ListProps {

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
      entryIds: this.entryIds,
      title: this.title,
      updatedAt: this.updatedAt,
    };
  }

  // ---------------------------
  // exterior relations
  // ---------------------------

  @Column(DataTypes.ARRAY(DataTypes.INTEGER))
  public entryIds!: Array<number>;

  @HasMany(() => Entry, 'listId')
  public entries!: Array<Entry>;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
