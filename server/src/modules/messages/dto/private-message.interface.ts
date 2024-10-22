export interface IPrivateMessage {
  fromUserName: string;
  toUserName: string;
  messageType: "text" | "media";
  text?: string;
  media?: Buffer;
}
