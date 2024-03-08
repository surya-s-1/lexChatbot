import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { ConversationSchema } from "./conversation.schema";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGODB_URL, {dbName: process.env.MONGODB_DBNAME}),
        MongooseModule.forFeature([{name: 'Conversation', schema: ConversationSchema}])
    ],
    controllers: [ConversationController],
    providers: [ConversationService]
})
export class ConversationModule {}