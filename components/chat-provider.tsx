"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useChat } from "@/hooks/use-chat"
import type { ChatState, BackgroundSettings } from "@/types/chat"

interface ChatContextType {
  chatState: ChatState
  sendMessage: (content: string) => void
  setCurrentSender: (senderId: string) => void
  setTheme: (theme: ChatState["theme"]) => void
  setGroupName: (groupName: string) => void
  setBackgroundSettings: (background: BackgroundSettings) => void // Added background settings setter
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const chatHook = useChat()

  return <ChatContext.Provider value={chatHook}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}
