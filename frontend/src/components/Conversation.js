import { useEffect, useState, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MessageWrapper, { LoadingWrapper } from "./MessageWrapper"
import { verifyJwt } from "../utilities/verifytoken"
import { getAllMessagesAPI, sendUserMessageAPI, getBotMessagesAPI } from "../utilities/api"
import { ErrorModal } from "./Modals"
import { InputBar, NavBar } from "./Components"

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
  const [initial, setInitial] = useState(true)

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

          const newMessages = data.conversation.messages.filter(message => !messageIds.current.has(message.messageId))
  
          let cumulativeCharacters = 0;
  
          if (initial) {
            setMessages(prevMsgs => [...prevMsgs, ...newMessages])

            for (let i = 0; i < newMessages.length; i++) {
              messageIds.current.add(newMessages[i].messageId)
            }

            setInitial(false)
          } else {
            for (let i = 0; i < newMessages.length; i++) {
  
              setTimeout(()=>{
                  setMessages(prevMsgs => [...prevMsgs, newMessages[i]])
                }, data.conversation.state === "Close" ? 0 : cumulativeCharacters * 2000 / 75)
    
              cumulativeCharacters += newMessages[i].content.length
    
              messageIds.current.add(newMessages[i].messageId)
            }
          }
  
          scrollDown.current.scrollIntoView(true, {
            behavior: 'smooth'
          })
          
          document?.getElementById("input")?.focus()
        } else if (data.tokenValid && data.conversation===null) {
          setErrMsg("Conversation not available")
        } else if (!data.tokenValid) {
          setErrMsg("Something wrong... Go to home page")
        }
      } catch (err) {
        setErrMsg("Internal Error")
        console.log(err)
      }
    } else {
      navigate('/login')
    }

  }, [params.id, navigate, initial])

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

      <NavBar backFn={()=>{navigate('/home')}} />

      <ErrorModal isOpen={errMsg !== ""} errMsg={errMsg} />

      <div className="row" style={{zIndex:-1, marginTop:'10%', marginBottom:'25%',overflow:'hidden'}}>
        <div className="d-grid gap-0 p-0">
            {messages?.map(message => (
              <div className={"p-1 m-0"} key={message.messageId}>
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
        <InputBar input={input} loading={loading} onChange={value => setInput(value)} onClick={e => {
          handleSendUserMessage(e)
          handleGetBotResponse(e)
          }} />
      )}
    </div>
  )
}