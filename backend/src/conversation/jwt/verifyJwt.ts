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
    
            if (Date.now() > decoded.exp*1000) {
                return {
                    tokenValid: false,
                    message: 'Session expired. Login Again'
                }
            }

            return {
                tokenValid: true
            }
        } catch (error) {
            console.error('JWT verify error: ', error)
        }
    }
}