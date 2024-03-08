import { jwtDecode } from "jwt-decode";

export function verifyJwt(token) {
    const decoded = jwtDecode(token)

    if (Date.now() < decoded.exp*1000) {
        return true
    } else {
        localStorage.removeItem('token')
        return false
    }
}