
import { UserAccount } from './user';

export interface Customer extends UserAccount {
  lastActive: Date;
  tags: string[];
}
