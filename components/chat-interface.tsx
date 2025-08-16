"use client"

import { useEffect, useRef } from "react"
import { useChatContext } from "./chat-provider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ScrollArea } from "./ui/scroll-area"
import { Phone, Video, MoreVertical, Smile, Paperclip, Mic } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatInterface() {
  const { chatState } = useChatContext()
  const { messages, members, currentViewer, theme, groupName } = chatState
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const getMemberById = (id: string) => members.find((member) => member.id === id)

  const getThemeStyles = (isMe: boolean) => {
    const themes = {
      rose: {
        me: "bg-gradient-to-r from-rose-500/80 to-pink-500/80 border-rose-300/30 text-white shadow-rose-500/20",
        other: "bg-white/15 border-white/25 text-white",
      },
      minimal: {
        me: "bg-gray-600/80 border-gray-400/30 text-white",
        other: "bg-white/10 border-white/20 text-white",
      },
      brown: {
        me: "bg-gradient-to-r from-amber-600/80 to-orange-600/80 border-amber-400/30 text-white shadow-amber-500/20",
        other: "bg-stone-200/15 border-stone-300/25 text-white",
      },
      dark: {
        me: "bg-gray-800/90 border-gray-600/40 text-white",
        other: "bg-gray-700/60 border-gray-500/30 text-white",
      },
    }
    return themes[theme][isMe ? "me" : "other"]
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-t-2xl p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {members.map((member) => (
              <Avatar key={member.id} className="w-8 h-8 border-2 border-white/20">
                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                <AvatarFallback className="text-xs bg-white/10">{member.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">{groupName}</h3>
            <p className="text-white/60 text-sm">{members.length} members</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Phone className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Video className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <MoreVertical className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 px-2">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="text-center text-white/50 py-8">
              <div className="animate-pulse">
                <p>No messages yet. Start the conversation!</p>
                <p className="text-sm mt-2">Use the admin panel to send messages</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const sender = getMemberById(message.senderId)
              const isMe = message.senderId === currentViewer
              const isLatestMessage = index === messages.length - 1

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 transition-all duration-500",
                    "animate-in slide-in-from-bottom-2 fade-in-0",
                    isMe ? "justify-end" : "justify-start",
                    isLatestMessage && "animate-in slide-in-from-bottom-4 duration-700",
                  )}
                  style={{
                    animationDelay: isLatestMessage ? "0ms" : `${index * 50}ms`,
                  }}
                >
                  {!isMe && sender && (
                    <Avatar className="w-8 h-8 mt-1 transition-transform hover:scale-110">
                      <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
                      <AvatarFallback className="text-xs bg-white/10 text-white">{sender.name[0]}</AvatarFallback>
                    </Avatar>
                  )}

                  <div className={cn("max-w-[70%] flex flex-col", isMe ? "items-end" : "items-start")}>
                    {!isMe && sender && (
                      <span className="text-white/60 text-xs mb-1 px-2 animate-in fade-in-50 duration-300">
                        {sender.name}
                      </span>
                    )}

                    <div
                      className={cn(
                        "px-4 py-2 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
                        "backdrop-blur-md border",
                        getThemeStyles(isMe),
                        isMe ? "rounded-br-md" : "rounded-bl-md",
                        isLatestMessage && "animate-bounce-in",
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    <span className="text-white/40 text-xs mt-1 px-2 animate-in fade-in-30 duration-500">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {isMe && sender && (
                    <Avatar className="w-8 h-8 mt-1 transition-transform hover:scale-110">
                      <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
                      <AvatarFallback className="text-xs bg-white/10 text-white">{sender.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-b-2xl p-4 mt-4">
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Paperclip className="w-5 h-5 text-white/70" />
          </button>
          <div className="flex-1 fake-input flex items-center justify-between">
            <span className="text-white/50">Type a message...</span>
            <Smile className="w-5 h-5 text-white/50" />
          </div>
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Mic className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>
    </div>
  )
}
