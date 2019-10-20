export interface PublicData {
  id: number;
  createdAt: string;
}

export interface PublicEntity {
  getPublicData: () => PublicData;
}