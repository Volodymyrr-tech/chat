import { User } from "src/modules/users/users.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";

@Entity("private_messages")
export class PrivateMessage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.sentMessages)
  fromUser: User;

  @ManyToOne(() => User, (user) => user.receivedMessages)
  toUser: User;

  @Column({ type: "enum", enum: ["text", "media"], default: "text" })
  messageType: string;

  @Column({ nullable: true })
  text: string; // Text message

  @Column({ type: "bytea", nullable: true })
  media: Buffer; // Store media as bytea

  @CreateDateColumn()
  createdAt: Date;
}