// src/modules/messages/dto/create-group-message.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInstance,
} from "class-validator";

export class CreateGroupMessageDto {
  @IsString()
  @IsNotEmpty()
  fromUserId: string; // ID of the user sending the message

  @IsString()
  @IsNotEmpty()
  groupId: string; // ID of the group where the message is sent

  @IsEnum(["text", "media"])
  messageType: "text" | "media"; // Message type: text or media

  @IsOptional()
  @IsString()
  text?: string; // Text message

  @IsOptional()
  @IsInstance(Buffer)
  media?: Buffer; // Media file (for bytea storage)
}
