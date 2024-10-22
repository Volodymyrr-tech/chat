import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Group } from "../groups/groups.entity";
import { PrivateMessage } from "../messages/entities/private-messages.entity";
import { GroupMessage } from "../messages/entities/group-messages.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];

  @OneToMany(() => PrivateMessage, (message) => message.fromUser)
  sentMessages: PrivateMessage[];

  @OneToMany(() => PrivateMessage, (message) => message.toUser)
  receivedMessages: PrivateMessage[];

  @OneToMany(() => GroupMessage, (message) => message.fromUser)
  groupMessages: GroupMessage[];
}
