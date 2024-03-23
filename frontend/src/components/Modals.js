import Modal from "react-modal"
import { IoReload } from "react-icons/io5"
import { FaStop, FaUndo } from "react-icons/fa"
import { errorModal, defaultModal, biggerFontSizeModal, listeningModal } from '../styles/modal.js'
import { TypeAnimation } from "react-type-animation"
import { TailSpin } from "react-loading-icons"
import '../styles/style.css'

export const ErrorModal = ({isOpen, errMsg}) => {
    return(
        <Modal
            isOpen={isOpen}
            style={errorModal}
        >
            <div className="d-flex flex-column justify-content-center">
                <div>{errMsg}</div>
                <button 
                className="btn btn-link px-0 py-0 m-0"
                style={{color: 'black', textDecoration: 'None'}}
                onClick={()=>{window.location.reload()}}
                >
                Reload <IoReload />
                </button>
            </div>
        </Modal>
    )
}

export const FetchingModal = ({isOpen, msg}) => {
    return(
        <Modal
            isOpen={isOpen}
            style={defaultModal}
        >
            <TypeAnimation preRenderFirstString={true} sequence={[msg,650,msg+'...']} speed={65} repeat={Infinity} cursor={false} />
        </Modal>
    )
}

export const RedirectingModal = ({isOpen, msg}) => {
    return(
        <Modal
            isOpen={isOpen}
            style={biggerFontSizeModal}
        >
            Redirecting <TailSpin stroke="#000000" />
        </Modal>
    )
}

export const DeleteModal = ({isOpen, yesFn, noFn}) => {
    return(
        <Modal
            isOpen={isOpen}
            style={biggerFontSizeModal}
        >
            <div>Confirm the deletion?</div>
            <div className="d-flex flex-row-reverse justify-content-around">
                <button 
                    className="btn btn-danger px-3 py-2 m-2 float-start"
                    onClick={yesFn}>
                    Yes
                </button>
                <button 
                    className="btn btn-primary px-3 py-2 m-2 float-end"
                    onClick={noFn}>
                    No
                </button>
            </div>
        </Modal>
    )
}

export const ListeningModal = ({isOpen, transcript, resetFn, stopFn}) => {

    document.addEventListener('keydown', e => {
        if (e.key === 'S' && e.shiftKey) {
            stopFn()
        }
    })

    document.addEventListener('keydown', e => {
        if (e.key === 'R' && e.shiftKey) {
            resetFn()
        }
    })

    return(
        <Modal
            isOpen={isOpen}
            style={listeningModal}
        >
            <div className="d-flex flex-column" style={{overflow: 'hidden'}}>
                <div className="align-self-center">
                    Listening...
                </div>
                <div className="scroll" style={{fontSize: '24px'}}>
                    {transcript}
                </div>
                <div className="align-self-center">
                    <button title="Stop (Shift + S)" className="btn btn-secondary border-0 m-1" onClick={stopFn}>
                        <FaStop />
                    </button>
                    <button title="Reset (Shift + R)" className="btn btn-secondary border-0 m-1" onClick={stopFn}>
                        <FaUndo />
                    </button>
                </div>
            </div>
        </Modal>
    )
}