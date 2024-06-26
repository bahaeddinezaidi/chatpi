import { User } from './user';
import { Room } from './room';

export interface Message {
  _id?: string;
  text?: string;
  owner?: User ;
  room?: Room | string;
  created?: Date | string;
}
