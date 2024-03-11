import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./authentication.schema";
import { UserController } from "./authentication.controller";
import { UserService } from "./authentication.service";
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            cache: true
        }),
        MongooseModule.forRoot(process.env.MONGODB_URL, {dbName: process.env.MONGODB_DBNAME}),
        MongooseModule.forFeature([{name: 'User', schema: UserSchema}])
    ],
    controllers: [UserController],
    providers: [UserService]
})
export class AuthenticationModule {}