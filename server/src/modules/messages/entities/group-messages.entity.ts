import { Group } from "src/modules/groups/groups.entity";
import { User } from "src/modules/users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

@Entity("group_messages")
export class GroupMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.groupMessages)
  fromUser: User;

  @ManyToOne(() => Group, (group) => group.messages)
  group: Group;

  @Column({ type: "enum", enum: ["text", "media"], default: "text" })
  messageType: string;

  @Column({ nullable: true })
  text: string; // Text message

  @Column({ type: "bytea", nullable: true })
  media: Buffer; // Store media as bytea

  @CreateDateColumn()
  createdAt: Date;
}
