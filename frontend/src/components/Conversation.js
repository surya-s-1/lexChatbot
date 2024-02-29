import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import MessageWrapper from "./Message"

export default function Conversation() {
  const params =  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [fulfilled, setFulfilled] = useState(false)

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/conversations/${params.id}`)
      const conversation = await response.json()

      if (conversation.state === "Close") {
        setFulfilled(true)
      } else {
        setFulfilled(false)
      }

      setMessages(conversation.messages)
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [params.id]);


  useEffect(()=> {
    fetchMessages()

    setInput("Hi")
  },[params.id, fetchMessages])

  const handleSend = async (e) => {
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
    }
  }

  return (
    <div className="container" style={{width: '40%'}}>
      <nav class="navbar-expand-sm navbar-light bg-primary row position-fixed top-0"
       style={{zIndex: 1, width: '40%', height: '7%', boxShadow: "0 1px 1px grey"}}>
        <div class="collapse navbar-collapse">
          <div class="navbar-nav">
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
        </div>
        <div className="font-weight-light">
            <p style={{color: 'red'}}>
              {fulfilled?"This conversation is closed":null}
            </p>
            <p className="text-center" style={{fontSize: '12px', color: 'grey'}}>
              {fulfilled?null:"This conversation is in progress"}
            </p>
        </div>
      </div>
      <div className="row position-fixed bottom-0 p-0 m-0" style={{maxHeight: '20%', width: '40%', zIndex: 0}}>
        <form className="row">
          <textarea 
            className="form-control col" 
            placeholder="Type here..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ resize: 'none', height: 'auto', overflow: 'hidden' }} 
            disabled={fulfilled}
          />
          <button 
            type="button" 
            className="btn btn-primary mt-2" 
            onClick={e => handleSend(e)}
            disabled={fulfilled}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}