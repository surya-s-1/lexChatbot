import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { verifyJwt } from "../utilities/verifytoken";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [successMessage, setSuccessMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${process.env.REACT_APP_LOGIN_URL}`, {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: { 'Content-Type' : 'application/json' }
            })

            const data = await response.json()

            if (!data.success) {
                setErrorMessage(data.message)
                setSuccessMessage(null)
            } else {
                setSuccessMessage(data.message)
                setErrorMessage(null)

                localStorage.setItem('token',data.token)

                setTimeout(()=>{
                    navigate('/home')
                }, 1000)
            }
        } catch (err) {
            console.error('Login failed: ', err)
        }
    }

    useEffect(()=>{
        const tokenIsValid = verifyJwt()

        if (tokenIsValid.isValid) {
            navigate('/home')
        }
    },[navigate])

    return(
        <div className="container" style={{maxWidth: '40%'}}>
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="form-group">
                <input type="email" className="form-control my-2" placeholder="Enter Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div className="form-group my-1">
                <input type="password" className="form-control my-2" placeholder="Enter Password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            {errorMessage ? 
            (<div className="alert alert-danger my-1 p-2">
                {errorMessage}
            </div>) : null}
            {successMessage ? 
            (<div className="alert alert-success my-1 p-2">
                {successMessage}
            </div>) : null}
            <button type="submit" className="btn btn-primary my-3">Login</button>
        </form>
        <small>Don't have an account yet? <a href="/register">Register</a> </small>
        </div>
    )
}