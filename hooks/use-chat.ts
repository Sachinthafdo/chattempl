"use client"

import { useState, useCallback } from "react"
import { type ChatState, type Message, MEMBERS, type BackgroundSettings } from "@/types/chat"

const initialState: ChatState = {
  members: MEMBERS,
  messages: [],
  currentSender: "imandi",
  currentViewer: "imandi",
  theme: "rose",
  groupName: "Group Chat",
  background: {
    type: "gradient",
    solidColor: "#22c55e",
    solidOpacity: 1,
    gradientType: "linear",
    gradientDirection: "to-br",
    gradientColors: [
      { color: "#16a34a", opacity: 0.9, position: 0 },
      { color: "#22c55e", opacity: 0.8, position: 50 },
      { color: "#15803d", opacity: 0.9, position: 100 },
    ],
  },
}

export function useChat() {
  const [chatState, setChatState] = useState<ChatState>(initialState)

  const sendMessage = useCallback(
    (content: string) => {
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: chatState.currentSender,
        content,
        timestamp: new Date(),
      }

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }))
    },
    [chatState.currentSender],
  )

  const setCurrentSender = useCallback((senderId: string) => {
    setChatState((prev) => ({
      ...prev,
      currentSender: senderId,
    }))
  }, [])

  const setCurrentViewer = useCallback((viewerId: string) => {
    setChatState((prev) => ({
      ...prev,
      currentViewer: viewerId,
    }))
  }, [])

  const setTheme = useCallback((theme: "rose" | "minimal" | "brown" | "dark") => {
    setChatState((prev) => ({
      ...prev,
      theme,
    }))
  }, [])

  const setGroupName = useCallback((groupName: string) => {
    setChatState((prev) => ({
      ...prev,
      groupName,
    }))
  }, [])

  const setBackgroundSettings = useCallback((background: BackgroundSettings) => {
    setChatState((prev) => ({
      ...prev,
      background,
    }))
  }, [])

  return {
    chatState,
    sendMessage,
    setCurrentSender,
    setCurrentViewer,
    setTheme,
    setGroupName,
    setBackgroundSettings,
  }
}
