import { useNavigate } from "react-router-dom";
import { useState } from "react";

const apiBaseUrl = `http://localhost:8000`

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: 'POST',
                body: JSON.stringify({email, password}),
                headers: { 'Content-Type' : 'application/json' }
            })

            const data = await response.json()

            if (!data.success) {
                setMessage(data.message)
            } else {
                setMessage(data.message)

                localStorage.setItem('token',data.token)
                localStorage.setItem('email',data.email)

                navigate('/home')
            }
        } catch (err) {
            console.error('Login failed: ', err)
        }
    }

    return(
        <form className="container" onSubmit={handleSubmit} style={{maxWidth: '40%'}}>
            <h1>Login</h1>
            <div className="form-group">
                <label>Email address</label>
                <input type="email" class="form-control" placeholder="Enter email" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" class="form-control" placeholder="Enter Password" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <br />
            {message ? 
            (<div className="alert alert-danger" role="alert">
                {message}
            </div>) : null}
            <br />
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    )
}