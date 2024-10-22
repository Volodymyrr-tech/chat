// src/modules/messages/dto/create-private-message.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsInstance,
} from "class-validator";

export class CreatePrivateMessageDto {
  @IsString()
  @IsNotEmpty()
  fromUserId: string; // ID of the user sending the message

  @IsString()
  @IsNotEmpty()
  toUserId: string; // ID of the recipient user

  @IsEnum(["text", "media"])
  messageType: "text" | "media"; // Message type: text or media

  @IsOptional()
  @IsString()
  text?: string; // Text message

  @IsOptional()
  @IsInstance(Buffer)
  media?: Buffer; // Media file (for bytea storage)
}
