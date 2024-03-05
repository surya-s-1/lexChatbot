import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import { BsFillSendFill } from "react-icons/bs"
import MessageWrapper, {LoadingWrapper} from "./Message"

export default function Conversation() {
  const params =  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [closed, setClosed] = useState(false)
  const scrollDown = useRef(null)

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/conversations/${params.id}`)
      const conversation = await response.json()

      if (conversation.state === "Close") {
        setClosed(true)
      } else {
        setClosed(false)
      }

      setMessages(conversation.messages)

      scrollDown.current.scrollIntoView(true,{
        behavior: 'smooth'
      })
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [params.id]);


  useEffect(()=> {
    fetchMessages()
  },[fetchMessages])

  const handleSendUserMessage = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {
      const newMessage = {
        content: input,
        sender: "user"
      }

      const response = await fetch(`http://localhost:8000/conversations/${params.id}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        })
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      fetchMessages()
      setInput("")
      setLoading(true)
    }
  }

  const handleGetBotResponse = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {
      const newMessage = {
        content: input
      }

      const response = await fetch(`http://localhost:8000/conversations/${params.id}/botmessages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newMessage),
        })
      
      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      fetchMessages()
      setInput("")
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{width: '40%'}}>
      <nav class="row navbar-expand-sm navbar-light bg-primary position-fixed top-0"
       style={{zIndex: 1, width: '40%', height: '7%', boxShadow: "0 1px 1px grey"}}>
        <div class="collapse navbar-collapse">
          <div class="navbar-nav d-flex">
            <button class="nav-link px-2" style={{color: 'white'}} onClick={()=>{navigate('/')}}>
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

      <form className="d-flex flex-row position-fixed bottom-0 p-0 m-0 border rounded" style={{width: '40%', height: '8%'}}>
        <input 
          className="form-control border-0" 
          placeholder="Type here..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={closed}
        />
        <button 
          type="submit" 
          className="btn btn-white" 
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