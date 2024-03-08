import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Conversation, ConversationDocument } from "./conversation.schema";
import { Bot } from "./lex/lex.client";
import { sanitizeInput } from "../utilities/sanitizeInput";

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
    ) {}

    async createConversation(): Promise<Conversation> {
        function sessionId() {
            return Date.now().toString()
        }
        
        const sessionNow = sessionId()

        const newConversation = this.conversationModel.create({sessionId: sessionNow, messages: []})
        return newConversation
    }

    async addMessage(conversationId: string, content: string, sender: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findById(new Object(conversationId))
        const timestamp = new Date(Date.now())
        const sanitizedMsg = sanitizeInput(content)
        const newMessage = { content: sanitizedMsg, sender, timestamp }

        conversation.messages.push(newMessage)
        
        return conversation.save()
    }

    async getBotMessages(conversationId: string, content: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findById(new Object(conversationId))

        const sanitizedInputMsg = sanitizeInput(content)
        const botResponse = await Bot(conversation.sessionId, sanitizedInputMsg)

        botResponse.messages?.map(message => {
            const timestampBot = new Date(Date.now())

            const sanitizedMsg = sanitizeInput(message['content'])
            const newMessageBot = { content: sanitizedMsg, sender: "chatbot", timestamp: timestampBot}

            conversation.messages.push(newMessageBot)
        })

        conversation.state = botResponse.sessionState.dialogAction.type==="Close"?"Close":"InProgress"

        return conversation.save()
    }

    async getConversation(conversationId: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findById(new Object(conversationId))
        return conversation
    }

    async getAllConversations() {
        const conversations = await this.conversationModel.find().exec()
        return conversations
    }

    async deleteConversation(conversationId: string) {
        const result = await this.conversationModel.deleteOne({_id: new Object(conversationId)})
        if (result.deletedCount === 1) {
            return {success: true}
        } else {
            return {success: false}
        }
    }
}