import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ConversationService } from './conersation.service';
import { Conversation } from './conversation.schema';

@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('create')
    async createConversation(): Promise<Conversation> {
        return this.conversationService.createConversation();
    }

    @Get()
    async getConversations() {
        return this.conversationService.getAllConversations();
    }

    @Get(':id')
    async getConversation(@Param('id') conversationId: string): Promise<Conversation | null> {
        return this.conversationService.getConversation(conversationId);
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id') conversationId: string,
        @Body('content') content: string,
        @Body('sender') sender: string
    ): Promise<Conversation> {
        const result = await this.conversationService.addMessage(conversationId, content, sender)
        return result
    }
}