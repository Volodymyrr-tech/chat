import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { GroupMessage } from "../messages/entities/group-messages.entity";
import { User } from "../users/users.entity";

@Entity("groups")
export class Group {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => GroupMessage, (message) => message.group)
  messages: GroupMessage[];
}
