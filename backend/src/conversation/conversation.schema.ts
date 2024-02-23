import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";
import { Message, MessageSchema } from "../message/message.schema";

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
    @Prop({type: [MessageSchema]})
    messages: Message[]
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)