import {Model, Table, Column, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Game} from './Game';
import {List} from './List';
import {User} from './User';
import {PublicEntity, PublicData} from './PublicInterfaces';

interface PublicEntryData extends PublicData {
  gameId: number;
  listId: number;
  text: string;
}

export interface EntryProps {
  text: string;
  gameId: number;
  listId: number;
}

@Table
export class Entry extends Model implements PublicEntity, EntryProps {

  // ---------------------------
  // class data
  // ---------------------------

  @Column
  public text!: string;

  public getPublicData(): PublicEntryData {
    return {
      id: this.id,
      createdAt: this.createdAt,
      gameId: this.gameId,
      listId: this.listId,
      text: this.text
    };
  }

  // ---------------------------
  // exterior relations
  // ---------------------------

  @ForeignKey(() => Game)
  @Column
  public gameId!: number;

  @BelongsTo(() => Game, 'gameId')
  public game!: Game;

  @ForeignKey(() => List)
  @Column
  public listId!: number;

  @BelongsTo(() => List, 'listId')
  public list!: List;

  @ForeignKey(() => User)
  @Column
  public userId!: number;

  @BelongsTo(() => User, 'userId')
  public user!: User;

}
