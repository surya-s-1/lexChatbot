import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    }, [])

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

    return (
        <div className="container" style={{ width: '40%' }}>
            <h2>Conversations</h2>
            <ul className="list-group">
                {conversations.map((conversation) => (
                    <li className="list-group-item list-group-item-action" key={conversation._id}>
                        <Link className="list-group-item-action" to={`/conversations/${conversation._id}`}>Conversation {conversation._id}</Link>
                    </li>
                ))}
            </ul>
            <button className="position-fixed bottom-0 btn btn-primary" onClick={createConversation}>Start Conversation</button>
        </div>
    )
}