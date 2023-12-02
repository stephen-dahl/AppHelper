import { PersonInterface } from "./Membership";

export interface ConnectionInterface { id?: string, churchId?: string, conversationId?: string, personId?: string, displayName?: string, timeJoined?: Date, socketId?: string }
export interface ConversationInterface { id?: string, churchId?: string, contentType?: string, contentId?: string, title?: string, dateCreated?: Date, groupId?: string, visibility?: string, firstPostId?: string, lastPostId?: string, postCount?: number, allowAnonymousPosts?: boolean, messages?: MessageInterface[] }
export interface MessageInterface { id?: string, churchId?: string, conversationId?: string, personId?: string, displayName?: string, timeSent?: Date, timeUpdated?: Date, messageType?: string, content?: string, person?: PersonInterface }
export interface NotificationInterface  { id?: string, churchId?: string, personId?: string, contentType?: string, contentId:string, timeSent?: Date, isNew:boolean, message?:string, deliveryMethod?:string }
export interface NotificationPreferenceInterface  { id?: string, churchId?: string, personId?: string, allowPush:boolean, emailFrequency:string }
export interface PrivateMessageInterface { id?: string, churchId?: string, fromPersonId?: string, toPersonId?: string, conversationId?: string, notifyPersonId?: string, conversation?: ConversationInterface, person?: PersonInterface, deliveryMethod?: string }
export interface SocketActionHandlerInterface { action:string, id:string, handleMessage:(data:any) => void }
export type SocketPayloadAction = "message" | "deleteMessage" | "callout" | "attendance" | "prayerRequest" | "socketId" | "privateMessage" | "privateRoomAdded" | "videoChatInvite" | "reconnect";
export interface SocketPayloadInterface {  action: SocketPayloadAction, data: any }
