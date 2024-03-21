import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { IoIosArrowBack } from "react-icons/io"
import { BsFillSendFill } from "react-icons/bs"
import MessageWrapper, { LoadingWrapper } from "./MessageWrapper"
import { verifyJwt } from "../utilities/verifytoken"
import { getAllMessagesAPI, sendUserMessageAPI, getBotMessagesAPI } from "../utilities/api"
import { ErrorModal } from "./Modals"

export default function Conversation() {
  const params =  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [closed, setClosed] = useState(false)
  const [errMsg, setErrMsg] = useState("")
  const scrollDown = useRef(null)
  const messageIds = useRef(new Set())

  const fetchMessages = useCallback(async () => {
    const tokenIsValid = verifyJwt()

    if (tokenIsValid.isValid) {
      try {
        const response = await fetch(`${getAllMessagesAPI(params.id)}`, {
          method: 'POST',
          body: JSON.stringify({token: tokenIsValid.token}),
          headers: {
            'Content-Type': 'application/json',
          }
        })

        const data = await response.json()

        setLoading(false)

        if (data.tokenValid && data.conversation) {
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
        } else if (data.tokenValid && data.conversation===null) {
          setErrMsg("Conversation not available")
        } else if (!data.tokenValid) {
          setErrMsg("Something wrong... Go to home page")
        }
      } catch (err) {
        setErrMsg("Internal Error")
      }
    } else {
      navigate('/login')
    }

  }, [params.id, navigate])

  useEffect(()=> {
    fetchMessages()

    setLoading(true)
  },[fetchMessages])

  const handleSendUserMessage = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {
      const tokenIsValid = verifyJwt()

      if (tokenIsValid.isValid) {
        try {
          await fetch(`${sendUserMessageAPI(params.id)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: tokenIsValid.token, content: input.trim(), sender: "user"}),
          })
        } catch (err) {
          setErrMsg("Internal Error")
        }

        fetchMessages()
        setInput("")
        setTimeout(() => {
          setLoading(true)
        }, 500)
      } else {
        navigate('/login')
      }
    }
  }

  const handleGetBotResponse = async (e) => {
    e.preventDefault()
    if (input.trim() !== "") {

      const tokenIsValid = verifyJwt()

      if (tokenIsValid.isValid) {
        try {
          await fetch(`${getBotMessagesAPI(params.id)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({token: tokenIsValid.token, content: input.trim()}),
          })
        } catch (err) {
          setErrMsg("Internal Error")
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
      <nav className="row navbar-expand-sm navbar-light bg-primary position-fixed top-0"
       style={{zIndex: 1, width: '40%', height: '7%', boxShadow: "0 1px 1px grey"}}>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav d-flex">
            <button className="nav-link px-2" style={{color: 'white'}} onClick={()=>{navigate('/home')}}>
              <IoIosArrowBack />
            </button>
          </div>
        </div>
      </nav>

      <ErrorModal isOpen={errMsg !== ""} errMsg={errMsg} />

      <div className="row" style={{zIndex:-1, marginTop:'10%', marginBottom:'25%',overflow:'hidden'}}>
        <div className="d-grid gap-0 p-0">
            {messages?.map(message => (
              <div className={"p-1 m-0"} key={message._id}>
                <MessageWrapper content={message.content} sender={message.sender} timestamp={message.timestamp} closed={closed} />
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

      {closed?null:(
        <form className="d-flex flex-row position-fixed bottom-0 bg-white p-0 m-0 border rounded" style={{width: '40%', height: '8%'}}>
          <input 
            className="form-control border-0" 
            placeholder="Type here..."
            value={loading?"":input}
            onChange={e => setInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-secondary border-0 m-1" 
            onClick={e => {
              handleSendUserMessage(e)
              handleGetBotResponse(e)
            }}
          >
            <BsFillSendFill />
          </button>
        </form>
      )}
    </div>
  )
}