import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Message, MessageSchema } from "../message/message.schema";

export type ConversationDocument = Conversation & Document;

@Schema()
export class Conversation {
    @Prop({type: [MessageSchema]})
    messages: Message[]

    @Prop()
    sessionId: string
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation)