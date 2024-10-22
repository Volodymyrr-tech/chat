export declare class CreatePrivateMessageDto {
    fromUserId: string;
    toUserId: string;
    messageType: "text" | "media";
    text?: string;
    media?: Buffer;
}
