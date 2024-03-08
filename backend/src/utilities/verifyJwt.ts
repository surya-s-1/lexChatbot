const jwt = require('jsonwebtoken')
const privateKey = 'lexChatbotApp'

export function verifyJwt(token: string) {
    if (!token) {
        return {
            tokenValid: false,
            message: 'Login again'
        }
    } else {
        try {
            const decoded = jwt.verify(token, privateKey)
            
            return {
                tokenValid: true
            }
        } catch (error) {

            console.log(error)

            return {
                tokenValid: false,
                message: 'Session expired. Login Again'
            }
        }
    }
}