import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversationModule } from './conversation/conversation.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [ConfigModule.forRoot({
    cache: true
  }), AuthenticationModule, ConversationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
