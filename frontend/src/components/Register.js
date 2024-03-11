import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyJwt } from "../utilities/verifytoken";

export default function Register() {
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await fetch(`${process.env.REACT_APP_REGISTER_URL}`, {
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

    useEffect(()=>{
        const tokenIsValid = verifyJwt()

        if (tokenIsValid.isValid) {
            navigate('/home')
        }
    },[navigate])

    return(
        <div className="container" style={{maxWidth: '40%'}}>
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <div className="form-group">
                    <input type="name" className="form-control my-2" placeholder="Enter Name" value={name} onChange={e=>setName(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="email" className="form-control my-2" placeholder="Enter Email" value={email} onChange={e=>setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <input type="password" className="form-control my-2" placeholder="Enter Password" value={password} onChange={e=>setPassword(e.target.value)} required />
                </div>
                {message ? 
                (<div className="alert alert-danger" role="alert">
                    {message}
                </div>) : null}
                <button type="submit" className="btn btn-primary my-3">Register</button>
            </form>
            <small>Already have an account? <a href="/login">Login</a> </small>
        </div>
    )
}