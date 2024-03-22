import { IoIosArrowBack } from "react-icons/io"
import { BsFillSendFill } from "react-icons/bs"
import { FaMicrophone } from "react-icons/fa"
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { ListeningModal } from "./Modals"

export const NavBar = ({backFn}) => {
    return(
        <nav className="row navbar-expand-sm navbar-light bg-primary position-fixed top-0"
        style={{zIndex: 1, width: '40%', height: '7%', boxShadow: "0 1px 1px grey"}}>
            <div className="collapse navbar-collapse">
            <div className="navbar-nav d-flex">
                <button className="nav-link px-2" style={{color: 'white'}} onClick={backFn}>
                <IoIosArrowBack />
                </button>
            </div>
            </div>
        </nav>
    )
}

export const InputBar = ({input, loading, onChange, onClick}) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        browserSupportsContinuousListening
    } = useSpeechRecognition()
    
    const startFn = () => {
        resetTranscript()
        SpeechRecognition.startListening({continuous: true})
    }

    const stopFn = () => {
        SpeechRecognition.stopListening()
        if (transcript) {
            onChange(transcript)
        }
        resetTranscript()
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'M' && e.shiftKey) {
            startFn()
        }
    })
    
    return(
        <form className="d-flex flex-row position-fixed bottom-0 bg-white p-0 m-0 border rounded" style={{width: '40%', height: '8%'}}>

            <input 
                className="form-control border-0" 
                placeholder="Type here..."
                value={loading?"":input}
                onChange={e => onChange(e.target.value)}
            />

            <ListeningModal isOpen={listening} stopFn={()=>{stopFn()}} />

            <div className="d-flex flex-row-reverse">
                <button 
                    type="submit"
                    className="btn btn-link border-0 m-0" 
                    onClick={onClick}
                >
                    <BsFillSendFill />
                </button>

                {(browserSupportsSpeechRecognition && browserSupportsContinuousListening) ? (
                    <div className="row">
                        {listening ? null : 
                        <button type="input" className="btn btn-link border-0 mx-0 my-1" onClick={startFn}>
                            <FaMicrophone />
                        </button>}
                    </div>
                ) : null}
            </div>

        </form>
    )
}