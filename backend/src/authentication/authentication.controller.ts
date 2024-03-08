import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './authentication.service';

@Controller('')
export class UserController {
    constructor(private readonly UserService: UserService) {}

    @Post('login')
    async loginUser(
        @Body('email') email: string,
        @Body('password') password: string
    ): Promise<Object> {
        return this.UserService.loginUser(email, password)
    }

    @Post('register')
    async registerUser(
        @Body('name') name: string,
        @Body('email') email: string,
        @Body('password') password: string
    ): Promise<Object> {
        return this.UserService.registerUser(name, email, password)
    }
}