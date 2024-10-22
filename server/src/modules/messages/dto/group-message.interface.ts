export interface IGroupMessage {
  fromUserName: string;
  groupName: string;
  messageType: "text" | "media";
  text?: string;
  media?: Buffer;
}
