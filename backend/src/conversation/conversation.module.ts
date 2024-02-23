import {Module} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conersation.service";
import { ConversationSchema } from "./conversation.schema";

@Module({
    imports: [
        MongooseModule.forRoot('mongodb://localhost:27017', {dbName: 'conversations'}),
        MongooseModule.forFeature([{name: 'Conversation', schema: ConversationSchema}])
    ],
    controllers: [ConversationController],
    providers: [ConversationService]
})
export class ConversationModule {}