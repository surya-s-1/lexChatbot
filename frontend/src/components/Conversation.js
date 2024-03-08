import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import { BsFillSendFill } from "react-icons/bs"
import MessageWrapper, {LoadingWrapper} from "./Message"
import { verifyJwt } from "./verifytoken"

const apiBaseUrl = `http://localhost:8000`

export default function Conversation() {
  const params =  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [closed, setClosed] = useState(false)
  const scrollDown = useRef(null)
  const messageIds = useRef(new Set())

  const fetchMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        navigate('/login')
      }
      
      const tokenIsValid = verifyJwt(token)

      if (tokenIsValid) {
        const response = await fetch(`${apiBaseUrl}/conversations/${params.id}`, {
          method: 'POST',
          body: JSON.stringify({token}),
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const data = await response.json()
    
        if (data.conversation.state === "Close") {
          setClosed(true)
        } else {
          setClosed(false)
        }

        const newMessages = data.conversation.messages.filter(message => !messageIds.current.has(message._id))
        let cumulativeCharacters = 0;

        for (let i = 0; i < newMessages.length; i++) {
          
          setTimeout(()=>{
              setMessages(prevMsgs => [...prevMsgs, newMessages[i]])
            }, data.conversation.state === "Close" ? 0 : cumulativeCharacters * 2000 / 75)

          cumulativeCharacters += newMessages[i].content.length

          messageIds.current.add(newMessages[i]._id)
        }

        scrollDown.current.scrollIntoView(true, {
          behavior: 'smooth'
        })
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }

  }, [params.id, navigate])

  useEffect(()=> {
    fetchMessages()

    setInput("Hi")
  },[fetchMessages])

  const handleSendUserMessage = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {

      const token = localStorage.getItem('token')
      const tokenIsValid = verifyJwt(token)

      if (tokenIsValid) {
        const response = await fetch(`${apiBaseUrl}/conversations/${params.id}/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token, content: input, sender: "user"}),
          })
        
        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        fetchMessages()
        setInput("")
        setLoading(true)
      } else {
        navigate('/login')
      }
    }
  }

  const handleGetBotResponse = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {

      const token = localStorage.getItem('token')
      const tokenIsValid = verifyJwt(token)

      if (tokenIsValid) {
        const response = await fetch(`${apiBaseUrl}/conversations/${params.id}/botmessages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token, content: input}),
          })
        
        if (!response.ok) {
          throw new Error(`Failed to send message: ${response.status}`);
        }

        fetchMessages()
        setInput("")
        setLoading(false)
      } else {
        navigate('/login')
      }
    }
  }

  return (
    <div className="container" style={{width: '40%'}}>
      <nav class="row navbar-expand-sm navbar-light bg-primary position-fixed top-0"
       style={{zIndex: 1, width: '40%', height: '7%', boxShadow: "0 1px 1px grey"}}>
        <div class="collapse navbar-collapse">
          <div class="navbar-nav d-flex">
            <button class="nav-link px-2" style={{color: 'white'}} onClick={()=>{navigate('/home')}}>
              <IoIosArrowBack />
            </button>
          </div>
        </div>
      </nav>
      
      <div className="row" style={{zIndex:-1, marginTop:'10%', marginBottom:'25%',overflow:'hidden'}}>
        <div className="d-grid gap-0 p-0">
            {messages?.map(message => (
              <div className={"p-1 m-0"} key={message._id}>
                <MessageWrapper content={message.content} sender={message.sender} timestamp={message.timestamp} />
              </div>
            ))}
            {loading? (<LoadingWrapper />) : null}
        </div>
        <div className="font-weight-light">
            <p style={{color: 'red'}} ref={scrollDown}>
              {closed?"This conversation is closed":null}
            </p>
            <p className="text-center" style={{fontSize: '12px', color: 'grey'}}>
              {closed?null:"This conversation is in progress"}
            </p>
        </div>
      </div>

      <form className="d-flex flex-row position-fixed bottom-0 bg-white p-0 m-0 border rounded" style={{width: '40%', height: '8%'}}>
        <input 
          className="form-control border-0" 
          placeholder="Type here..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={closed}
        />
        <button 
          type="submit" 
          className="btn btn-secondary border-0 m-1" 
          onClick={e => {
            handleSendUserMessage(e)
            handleGetBotResponse(e)
          }}
          disabled={closed}
        >
          <BsFillSendFill />
        </button>
      </form>
    </div>
  );
}