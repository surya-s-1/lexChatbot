export default function MessageWrapper({content, sender, timestamp}) {
    const datetime = new Date(timestamp)
    const time = datetime.toLocaleTimeString()

    if (sender==='user') {
        return(
            <div className="alert alert-info p-2 m-0 float-end" style={{maxWidth: '75%'}}>
                {content}
                <div className="font-weight-light" style={{fontSize: '10px'}}>
                    {time}
                </div>
            </div>
        )
    } else {
        return(
            <div className="alert alert-secondary p-2 m-0 float-start" style={{maxWidth: '75%'}}>
            {content}
                <div className="font-weight-light" style={{fontSize: '10px'}}>
                    {time}
                </div>
            </div>
        )
    }
}