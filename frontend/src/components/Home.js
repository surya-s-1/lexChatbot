import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { MdDelete } from "react-icons/md";
import { TailSpin } from "react-loading-icons"
import { verifyJwt } from "../utilities/verifytoken";
import { getAllConversationsAPI, createConversationAPI, deleteConversationAPI } from "../utilities/api";

const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }  

export default function Home() {
    const [conversations, setConversations] = useState([])
    const [redirectModalOpen, setRedirectModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteConversationId, setDeleteConversationId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const tokenIsValid = verifyJwt()

                if (tokenIsValid.isValid) {
                    const response = await fetch(`${getAllConversationsAPI()}`, {
                        method: 'POST',
                        body: JSON.stringify({token: tokenIsValid.token}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    
                    if (!response.ok) {
                        throw new Error(`Error fetching conversations: ${response.status}`);
                    }
    
                    const data = await response.json()
                    
                    setConversations(data.conversation)
                } else {
                    navigate('/login')
                }
            } catch (error) {
                console.error('Error fetching conversations: ', error)
            }
        };

        fetchConversations();
    }, [conversations, navigate])

    const createConversation = async () => {
        try {
            const tokenIsValid = verifyJwt()

            if (tokenIsValid.isValid) {
                const response = await fetch(`${createConversationAPI()}`, {
                    method: 'POST',
                    body: JSON.stringify({token: tokenIsValid.token}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
    
                if (!response.ok) {
                    throw new Error(`Error creating conversation: ${response.status}`);
                }
    
                const data = await response.json()
                
                setConversations([...conversations, data?.conversation])
                setRedirectModalOpen(false)
                navigate(`/conversations/${data.conversation._id}`)
            } else {
                navigate('/login')
            }
        } catch (error) {
            console.error('Error creating conversation: ', error)
        }
    }

    const deleteConversation = async (conversationId) => {
        try {
            const tokenIsValid = verifyJwt()

            if (tokenIsValid.isValid) {
                await fetch(`${deleteConversationAPI(conversationId)}`, {
                    method: 'DELETE',
                    body: JSON.stringify({token: tokenIsValid.token}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } else {
                navigate('/login')
            }
        } catch (err) {
            console.log('Error deleting converstaion:', err)
        }
    }

    const logout = () => {
        try {
            localStorage.removeItem('token')

            navigate('/login')
        } catch (error) {
            console.log('Error logging out: ', error)
        }
    }

    return (
        <div className="container" style={{ width: '40%' }}>
            <nav className="navbar sticky-top navbar-light bg-light px-2 py-1" style={{zIndex: 1, height: '7%', boxShadow: "0 0 2px grey"}}>
                <h1 className="navbar-brand m-0">
                    Conversations
                </h1>
                <button 
                    className="btn btn-primary m-0" 
                    onClick={()=>{
                        createConversation()
                        setRedirectModalOpen(true)
                    }}
                >
                    Start Conversation
                </button>
                <button className="btn btn-danger m-0" onClick={logout}>
                    Logout
                </button>
            </nav>
            <Modal
                isOpen={redirectModalOpen}
                style={modalStyle}
            >
                <h3>Redirecting <TailSpin stroke="#000000" /></h3>
            </Modal>
            <Modal
                isOpen={deleteModalOpen}
                style={modalStyle}
            >
                <div><h4>Confirm the deletion?</h4></div>
                <div className="d-flex flex-row-reverse justify-content-around">
                    <button 
                        className="btn btn-danger px-3 py-2 m-2 float-start"
                        onClick={async ()=>{
                            await deleteConversation(deleteConversationId)
                            setDeleteConversationId(null)
                            setDeleteModalOpen(false)
                        }}>
                        Yes
                    </button>
                    <button 
                        className="btn btn-primary px-3 py-2 m-2 float-end"
                        onClick={()=>{
                            setDeleteModalOpen(false)
                        }}>
                        No
                    </button>
                </div>
            </Modal>
            <ul className="list-group my-2">
                {conversations?.map((conversation) => (
                    <li className="list-group-item list-group-item-action" key={conversation._id}>
                        <Link 
                            className="list-group-item-action" 
                            to={`/conversations/${conversation._id}`} 
                            style={{textDecoration: 'none'
                        }}>
                            Conversation {conversation._id}
                        </Link>

                        <button 
                            className="btn btn-danger px-1 py-0 m-0 float-end" 
                            onClick={()=>{
                                setDeleteConversationId(conversation._id)
                                setDeleteModalOpen(true)
                        }}>
                            <MdDelete />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}