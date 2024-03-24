import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { Conversation, ConversationDocument } from "./conversation.schema";
import { Bot } from "./lex/lex.client";
import { sanitizeMsgInput } from "../utilities/sanitizeInput";

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
    ) {}

    async createConversation(): Promise<Conversation> {

        const newConversation = await this.conversationModel.create({sessionId: uuidv4(), messages: []})

        const botResponse = await Bot(newConversation.sessionId, 'Hi')

        botResponse.messages?.map(message => {
            const timestampBot = new Date(Date.now())
            const sanitizedMsg = sanitizeMsgInput(message['content'])
            const newMessageBot = { messageId: uuidv4(), content: sanitizedMsg, sender: "chatbot", timestamp: timestampBot}

            newConversation.messages.push(newMessageBot)
        })

        newConversation.state = botResponse.sessionState.dialogAction.type

        return newConversation.save()
    }

    async addMessage(conversationId: string, content: string, sender: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findOne({sessionId: conversationId})
        const timestamp = new Date(Date.now())
        const sanitizedMsg = sanitizeMsgInput(content)
        const newMessage = { messageId: uuidv4(), content: sanitizedMsg, sender, timestamp }

        conversation.messages.push(newMessage)
        
        return conversation.save()
    }

    async getBotMessages(conversationId: string, content: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findOne({sessionId: conversationId})

        const sanitizedInputMsg = sanitizeMsgInput(content)
        const botResponse = await Bot(conversation.sessionId, sanitizedInputMsg)

        botResponse.messages?.map(message => {
            const timestampBot = new Date(Date.now())

            const sanitizedMsg = sanitizeMsgInput(message['content'])
            const newMessageBot = { messageId: uuidv4(), content: sanitizedMsg, sender: "chatbot", timestamp: timestampBot}

            conversation.messages.push(newMessageBot)
        })

        conversation.state = botResponse.sessionState.dialogAction.type

        return conversation.save()
    }

    async getConversation(conversationId: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findOne({sessionId: conversationId})
        return conversation
    }

    async getAllConversations() {
        const conversations = await this.conversationModel.find().exec()
        return conversations
    }

    async deleteConversation(conversationId: string) {
        const result = await this.conversationModel.deleteOne({sessionId: conversationId})
        if (result.deletedCount === 1) {
            return {success: true}
        } else {
            return {success: false}
        }
    }
}