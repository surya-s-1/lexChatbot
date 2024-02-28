import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop()
    content: string;

    @Prop()
    sender: string;

    @Prop()
    timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message)