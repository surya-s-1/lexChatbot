import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { verifyJwt } from './jwt/verifyJwt';

@Controller('conversations')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('create')
    async createConversation(
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            return this.conversationService.createConversation();
        } else {
            return verify
        }
    }

    @Get()
    async getConversations(
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            const result = await this.conversationService.getAllConversations()

            return {
                tokenValid: verify.tokenValid,
                conversation: result 
            }
        } else {
            return verify
        }
    }

    @Get(':id')
    async getConversation(
        @Param('id') conversationId: string,
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            const result = await this.conversationService.getConversation(conversationId)

            return {
                tokenValid: verify.tokenValid,
                conversation: result 
            }
        } else {
            return verify
        }
    }

    @Post(':id/messages')
    async addMessage(
        @Param('id') conversationId: string,
        @Body('content') content: string,
        @Body('sender') sender: string,
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            const result = await this.conversationService.addMessage(conversationId, content, sender)
            
            return {
                tokenValid: verify.tokenValid,
                conversation: result 
            }
        } else {
            return verify
        }
    }

    @Post(':id/botmessages')
    async getBotMessages(
        @Param('id') conversationId: string,
        @Body('content') content: string,
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            const result = await this.conversationService.getBotMessages(conversationId, content)
            
            return {
                tokenValid: verify.tokenValid,
                conversation: result 
            }
        } else {
            return verify
        }
    }

    @Delete(':id')
    async deleteConversation(
        @Param('id') conversationId: string,
        @Body('token') token: string
    ) {
        const verify = verifyJwt(token)

        if (verify.tokenValid) {
            const result = await this.conversationService.deleteConversation(conversationId)
            
            return {
                tokenValid: verify.tokenValid,
                conversation: result 
            }
        } else {
            return verify
        }
    }
}