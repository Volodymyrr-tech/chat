import { IsArray, ArrayNotEmpty } from "class-validator";

export class AddUsersToGroupDto {
  @IsArray()
  @ArrayNotEmpty()
  userIds: string[];
}
