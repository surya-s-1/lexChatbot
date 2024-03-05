import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

export default function Home() {
    const [conversations, setConversations] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('http://localhost:8000/conversations')
                
                if (!response.ok) {
                    throw new Error(`Error fetching conversations: ${response.status}`);
                }

                const data = await response.json()
                console.log(data)
                setConversations(data)
            } catch (error) {
                console.error('Error fetching conversations: ', error)
            }
        };

        fetchConversations();
    }, [conversations])

    const createConversation = async () => {
        try {
            const response = await fetch('http://localhost:8000/conversations/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!response.ok) {
                throw new Error(`Error creating conversation: ${response.status}`);
            }

            const newConversation = await response.json()
            setConversations([...conversations, newConversation])
            navigate(`/conversations/${newConversation._id}`)
        } catch (error) {
            console.error('Error creating conversation: ', error)
        }
    }

    const deleteConversation = async (conversationId) => {
        try {
            await fetch(`http://localhost:8000/conversations/${conversationId}`, {
                method: 'DELETE'
            })
        } catch (err) {
            console.log('Error deleting converstaion:', err)
        }
    }

    return (
        <div className="container" style={{ width: '40%' }}>
            <nav class="navbar sticky-top navbar-light bg-light px-2 py-1">
                <h1 class="navbar-brand m-0">
                    Conversations
                </h1>
                <button className="btn btn-primary m-0" onClick={createConversation}>
                    Start Conversation
                </button>
            </nav>
            <ul className="list-group">
                {conversations.map((conversation) => (
                    <li className="list-group-item list-group-item-action" key={conversation._id}>
                        <Link className="list-group-item-action" to={`/conversations/${conversation._id}`} style={{textDecoration: 'none'}}>Conversation {conversation._id}</Link>
                        <button className="btn btn-danger px-1 py-0 m-0 float-end" onClick={()=>{deleteConversation(conversation._id)}}>
                            <MdDelete />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}