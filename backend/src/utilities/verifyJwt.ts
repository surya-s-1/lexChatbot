import { ConfigModule } from "@nestjs/config"
const jwt = require('jsonwebtoken')

export async function verifyJwt(token: string) {
    await ConfigModule.envVariablesLoaded
    const privateKey = process.env.AUTH_PRIVATE_KEY

    if (!token) {
        return {
            tokenValid: false,
            message: 'Login again'
        }
    } else {
        try {
            await jwt.verify(token, privateKey)
            
            return {
                tokenValid: true
            }
        } catch (error) {
            console.log(error)

            return {
                tokenValid: false,
                message: 'Internal Error'
            }
        }
    }
}