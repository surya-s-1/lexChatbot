export const getAllConversationsAPI = () => {
    return `${process.env.REACT_APP_GET_CONVERSATIONS}`
}

export const createConversationAPI = () => {
    return `${process.env.REACT_APP_CREATE_CONVERSATION}`
}

export const deleteConversationAPI = (conversationId) => {
    return `${process.env.REACT_APP_GET_CONVERSATIONS}/${conversationId}`
}

export const getAllMessagesAPI = (conversationId) => {
    return `${process.env.REACT_APP_GET_CONVERSATIONS}/${conversationId}`
}

export const sendUserMessageAPI = (conversationId) => {
    return `${process.env.REACT_APP_GET_CONVERSATIONS}/${conversationId}/messages`
}

export const getBotMessagesAPI = (conversationId) => {
    return `${process.env.REACT_APP_GET_CONVERSATIONS}/${conversationId}/botmessages`
}