import { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiBaseUrl = `http://localhost:8000`

export default function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: 'POST',
                body: JSON.stringify({name, email, password}),
                headers: { 'Content-Type' : 'application/json' }
            })

            const data = await response.json()

            if (!data.success) {
                setMessage(data.message)
            } else {
                setMessage(data.message)

                navigate('/login')
            }
        } catch (err) {
            console.error('Register failed: ', err)
        }
    }

    return(
        <form className="container" onSubmit={handleSubmit} style={{maxWidth: '40%'}}>
            <h1>Register</h1>
            <div className="form-group">
                <label>Name</label>
                <input type="name" class="form-control" placeholder="Enter Name" value={name} onChange={e=>setName(e.target.value)} />
            </div>
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
            <button type="submit" class="btn btn-primary">Register</button>
        </form>
    )
}