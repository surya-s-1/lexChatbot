import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./authentication.schema";
import { UserController } from "./authentication.controller";
import { UserService } from "./authentication.service";

@Module({
    imports: [
        MongooseModule.forRoot(`mongodb://localhost:27017`, {dbName: 'lexChatbot'}),
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class AuthenticationModule {}