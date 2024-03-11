import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./authentication.schema";
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

const saltRounds = parseInt(process.env.AUTH_SALTROUNDS, 10)
const privateKey = process.env.AUTH_PRIVATE_KEY

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>
    ) {}

    async loginUser(email: string, password: string) {
        try {
            const user = await this.userModel.findOne({ email: email.toLowerCase() })

            if (!user) {
                return {
                    success: false,
                    message: 'User not found'
                }
            }

            const result = bcrypt.compareSync(password, user.password)
            
            if (result) {

                var token = jwt.sign({email: email.toLowerCase()}, privateKey, { expiresIn: '15m' })

                return {
                    token: token,
                    success: true,
                    message: 'Login successful'
                }
            } else {
                return {
                    success: false,
                    message: 'Wrong password'
                }
            }
        
        } catch (error) {
            console.log('Login Error: ', error)

            return {
                message: 'Internal Server Error'
            }
        }
    }

    async registerUser(name: string, email: string, password: string) {
        try {
            const user = await this.userModel.findOne({ email: email.toLowerCase() })

            if (user) {
                return {
                    success: false,
                    message: 'User already exists'
                }
            }

            const hash = bcrypt.hashSync(password, saltRounds)

            const addedUser = await this.userModel.create({name, email: email.toLowerCase(), password: hash})

            if (addedUser) {
                return {
                    success: true,
                    message: 'Registration successful'
                }
            } else {
                return {
                    success: false,
                    message: 'Registration failed'
                }
            }
        
        } catch (error) {
            console.log('Login Error: ', error)

            return {
                message: 'Internal Server Error'
            }
        }
    }
}