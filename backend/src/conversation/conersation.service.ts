import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Conversation, ConversationDocument } from "./conversation.schema";
import { Bot } from "./lex/lex.client";

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(Conversation.name)
        private conversationModel: Model<ConversationDocument>,
    ) {}

    async createConversation(): Promise<Conversation> {
        const newConversation = new this.conversationModel({messages: []})
        return newConversation.save()
    }

    async addMessage(conversationId: string, content: string, sender: string): Promise<Conversation> {
        const conversation = await this.conversationModel.findById(new Object(conversationId))
        const timestamp = new Date(Date.now())
        const newMessage = { content, sender, timestamp, intentState: 'query' }

        conversation.messages.push(newMessage)

        const botResponse = await Bot(content)

        botResponse.messages.map(message => {
            const timestampBot = new Date(Date.now())
            const newMessageBot = { content: message['content'], sender: "chatbot", timestamp: timestampBot, intentState: botResponse['sessionState']['intent']['state']}
            
            conversation.messages.push(newMessageBot)
        })

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
}