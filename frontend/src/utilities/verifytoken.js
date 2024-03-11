import { jwtDecode } from "jwt-decode";

export function verifyJwt() {
    const token = localStorage.getItem('token')
      
    if (!token) {
        localStorage.removeItem('token')
        return {
            isValid: false
        }
    }
    
    const decoded = jwtDecode(token)

    if (Date.now() < decoded.exp*1000) {
        return {
            isValid: true,
            token: token
        }
    } else {
        localStorage.removeItem('token')
        return {
            isValid: false
        }
    }
}