import Modal from "react-modal"
import { IoReload } from "react-icons/io5"
import { errorModal, defaultModal, biggerFontSizeModal } from '../styles/modal.js'
import { TypeAnimation } from "react-type-animation"
import { TailSpin } from "react-loading-icons"

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