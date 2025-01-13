enum ChatRole{
    USER = "user",
    BOT = "system"
}

export interface ChatMessage{
    role: ChatRole,
    message: string,
    sent_at: string,
    chat_id: string,
    sender_id: string
}