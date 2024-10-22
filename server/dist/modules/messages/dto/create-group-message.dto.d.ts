export declare class CreateGroupMessageDto {
    fromUserId: string;
    groupId: string;
    messageType: "text" | "media";
    text?: string;
    media?: Buffer;
}
