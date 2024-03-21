import { IoIosArrowBack } from "react-icons/io"
import { BsFillSendFill } from "react-icons/bs"

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
    return(
        <form className="d-flex flex-row position-fixed bottom-0 bg-white p-0 m-0 border rounded" style={{width: '40%', height: '8%'}}>
            <input 
                className="form-control border-0" 
                placeholder="Type here..."
                value={loading?"":input}
                onChange={e => onChange(e.target.value)}
            />
            <button 
                type="submit" 
                className="btn btn-secondary border-0 m-1" 
                onClick={onClick}
            >
                <BsFillSendFill />
            </button>
        </form>
    )
}