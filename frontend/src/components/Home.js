import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { MdDelete } from "react-icons/md"
import { verifyJwt } from "../utilities/verifytoken"
import { getAllConversationsAPI, createConversationAPI, deleteConversationAPI } from "../utilities/api"
import { DeleteModal, ErrorModal, FetchingModal, RedirectingModal } from "./Modals"

export default function Home() {
    const [conversations, setConversations] = useState([])
    const [redirectModalOpen, setRedirectModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [errMsg, setErrMsg] = useState("")
    const [deleteConversationId, setDeleteConversationId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchConversations = async () => {
            const tokenIsValid = verifyJwt()

            if (tokenIsValid.isValid) {
                try {
                    const response = await fetch(`${getAllConversationsAPI()}`, {
                        method: 'POST',
                        body: JSON.stringify({token: tokenIsValid.token}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
    
                    const data = await response.json()
                    
                    setConversations(data.conversation)
                    setFetching(false)
                } catch (err) {
                    setErrMsg("Internal Error")
                    setFetching(false)
                }
            } else {
                navigate('/login')
            }
        };

        fetchConversations();
    }, [conversations, navigate])

    const createConversation = async () => {
        const tokenIsValid = verifyJwt()

        if (tokenIsValid.isValid) {
            try {
                const response = await fetch(`${createConversationAPI()}`, {
                    method: 'POST',
                    body: JSON.stringify({token: tokenIsValid.token}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                const data = await response.json()
            
                setConversations([...conversations, data?.conversation])
                setRedirectModalOpen(false)
                window.open(`/conversations/${data.conversation.sessionId}`,'_blank')
            } catch (err) {
                setRedirectModalOpen(false)
                setErrMsg("Internal Error")
            }
        } else {
            navigate('/login')
        }
    }

    const deleteConversation = async (conversationId) => {
        const tokenIsValid = verifyJwt()

        if (tokenIsValid.isValid) {
            try {
                await fetch(`${deleteConversationAPI(conversationId)}`, {
                    method: 'DELETE',
                    body: JSON.stringify({token: tokenIsValid.token}),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            } catch (err) {
                setErrMsg("Internal Error")
            }
        } else {
            navigate('/login')
        }
    }

    const logout = () => {
        try {
            localStorage.removeItem('token')

            navigate('/login')
        } catch (error) {
            setErrMsg("Internal Error")
        }
    }

    const deleteFn = async () => {
        await deleteConversation(deleteConversationId)
        setDeleteConversationId(null)
        setDeleteModalOpen(false)
    }

    const noDeleteFn = () => {
        setDeleteConversationId(null)
        setDeleteModalOpen(false)
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
            
            <ErrorModal isOpen={errMsg!==""} errMsg={errMsg} />

            <FetchingModal isOpen={fetching} msg={'Fetching conversations'} />

            <RedirectingModal isOpen={redirectModalOpen} />

            <DeleteModal isOpen={deleteModalOpen} yesFn={deleteFn} noFn={noDeleteFn} />

            <ul className="list-group my-2">
                {((!fetching) && (conversations?.length===0))?(
                    <div className="d-flex justify-content-center">
                        No conversations available
                    </div>
                ):null}
                {conversations?.map((conversation) => (
                    <li className="list-group-item list-group-item-action" key={conversation.sessionId}>
                        <Link 
                            className="list-group-item-action" 
                            to={`/conversations/${conversation.sessionId}`} 
                            style={{textDecoration: 'none'
                        }}>
                            Conversation {conversation.sessionId}
                        </Link>

                        <button 
                            className="btn btn-danger px-1 py-0 m-0 float-end" 
                            onClick={()=>{
                                setDeleteConversationId(conversation.sessionId)
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