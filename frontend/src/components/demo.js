import MessageWrapper from "./Message"

export default function showMessages({messages}) {
    const msgElements = messages?.map(message => {
        return {
            element: (
                <div className={"p-1 m-0"} key={message._id}>
                    <MessageWrapper content={message.content} sender={message.sender} timestamp={message.timestamp} />
                </div>
            ),
            displayed: false
            }
        })

    return msgElements
}

export function ShowInProgress({closed}) {
    return(
        <div className="font-weight-light">
            <p style={{color: 'red'}}>
              {closed?"This conversation is closed":null}
            </p>
            <p className="text-center" style={{fontSize: '12px', color: 'grey'}}>
              {closed?null:"This conversation is in progress"}
            </p>
        </div>
    )
}