import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import MessageWrapper from "./Message";

export default function Conversation() {
  const params =  useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [fulfilled, setFulfilled] = useState(false)
  const [fulfilledMsg,setFulfilledMsg] = useState("")

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/conversations/${params.id}`);
      const conversation = await response.json()

      conversation.messages.map(message => {
        if(message.intentState==="Fulfilled") {
          setFulfilled(true)
          setFulfilledMsg("This conversation is closed")
        }
      })

      setMessages(conversation.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [params.id]);


  useEffect(()=> {
    fetchMessages()
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
      <div className="d-grid gap-0 p-0">
        {messages?.map(message => (
          <div className={"p-1 m-0"} key={message._id}>
            <MessageWrapper content={message.content} sender={message.sender} timestamp={message.timestamp} />
          </div>
        ))}
      </div>
      <div style={{marginBottom: '25%'}}>
          <p className="font-weight-light" style={{color: 'red'}}>{fulfilledMsg}</p>
      </div>
      <div className="position-fixed bottom-0" style={{maxHeight: '20%', width: '40%'}}>
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