"use client"

import type React from "react"

import { useState } from "react"
import { useChatContext } from "./chat-provider"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Send, User, MessageSquare, Edit3, Eye, Palette } from "lucide-react"
import { cn } from "@/lib/utils"
import { BackgroundCustomizer } from "./background-customizer"

export function AdminPanel() {
  const { chatState, sendMessage, setCurrentSender, setCurrentViewer, setTheme, setGroupName } = useChatContext()
  const { members, currentSender, currentViewer, theme, messages, groupName } = chatState
  const [messageInput, setMessageInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isEditingGroupName, setIsEditingGroupName] = useState(false)
  const [groupNameInput, setGroupNameInput] = useState(groupName)

  const handleSendMessage = async () => {
    if (messageInput.trim()) {
      setIsSending(true)
      await new Promise((resolve) => setTimeout(resolve, 200))
      sendMessage(messageInput.trim())
      setMessageInput("")
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSaveGroupName = () => {
    if (groupNameInput.trim()) {
      setGroupName(groupNameInput.trim())
      setIsEditingGroupName(false)
    }
  }

  const handleCancelEdit = () => {
    setGroupNameInput(groupName)
    setIsEditingGroupName(false)
  }

  const currentSenderData = members.find((member) => member.id === currentSender)
  const currentViewerData = members.find((member) => member.id === currentViewer)

  const themes = [
    { id: "rose", name: "Rose Neon", color: "from-rose-500 to-pink-500" },
    { id: "minimal", name: "Minimal", color: "from-gray-500 to-gray-600" },
    { id: "brown", name: "Warm Earth", color: "from-amber-600 to-orange-600" },
    { id: "dark", name: "Dark", color: "from-gray-800 to-gray-900" },
  ]

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] space-y-4 overflow-y-auto">
      {/* Admin Header */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Admin Control Panel
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-300 text-xs">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Background Customizer */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">Background Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <BackgroundCustomizer />
        </CardContent>
      </Card>

      {/* Group Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Group Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <label className="text-white/80 text-sm">Group Name</label>
            {isEditingGroupName ? (
              <div className="flex gap-2">
                <Input
                  value={groupNameInput}
                  onChange={(e) => setGroupNameInput(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  placeholder="Enter group name..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSaveGroupName()
                    } else if (e.key === "Escape") {
                      handleCancelEdit()
                    }
                  }}
                  autoFocus
                />
                <Button onClick={handleSaveGroupName} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                  Save
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white font-medium flex-1">{groupName}</span>
                <Button
                  onClick={() => setIsEditingGroupName(true)}
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Bubble Theme */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Chat Bubble Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg transition-all duration-200",
                  "border backdrop-blur-md hover:scale-[1.02]",
                  theme === themeOption.id
                    ? "bg-white/20 border-white/40 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                )}
              >
                <div className={cn("w-4 h-4 rounded-full bg-gradient-to-r", themeOption.color)} />
                <span className="text-white text-sm font-medium">{themeOption.name}</span>
                {theme === themeOption.id && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 ml-auto">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sender Selection */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">Select Active Sender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setCurrentSender(member.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                  "border backdrop-blur-md",
                  currentSender === member.id
                    ? "bg-white/20 border-white/40 shadow-lg animate-pulse-subtle"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-white/10 text-white">{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-white/60 text-sm">@{member.id}</p>
                </div>
                {currentSender === member.id && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 animate-pulse">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Select Chat Viewer */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Select Chat Viewer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {members.map((member) => (
              <button
                key={member.id}
                onClick={() => setCurrentViewer(member.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                  "border backdrop-blur-md",
                  currentViewer === member.id
                    ? "bg-blue-500/20 border-blue-400/40 shadow-lg animate-pulse-subtle"
                    : "bg-white/5 border-white/10 hover:bg-white/10",
                )}
              >
                <Avatar className="w-10 h-10">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback className="bg-white/10 text-white">{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-white/60 text-sm">Viewing as {member.name}</p>
                </div>
                {currentViewer === member.id && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 animate-pulse">Viewing</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Status Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSenderData && (
          <Card className="bg-white/15 backdrop-blur-md border-white/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentSenderData.avatar || "/placeholder.svg"} alt={currentSenderData.name} />
                  <AvatarFallback className="bg-white/10 text-white text-xs">
                    {currentSenderData.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm">Sending as:</p>
                  <p className="text-white font-semibold">{currentSenderData.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Viewer Display */}
        {currentViewerData && (
          <Card className="bg-blue-500/15 backdrop-blur-md border-blue-400/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentViewerData.avatar || "/placeholder.svg"} alt={currentViewerData.name} />
                  <AvatarFallback className="bg-blue-500/10 text-white text-xs">
                    {currentViewerData.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white text-sm">Viewing as:</p>
                  <p className="text-white font-semibold">
                    {currentViewerData.name} {currentViewer === currentSender && "(Me)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Message Input */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Send Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              disabled={isSending}
              className={cn(
                "min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm resize-none transition-all duration-200",
                isSending && "opacity-50 cursor-not-allowed",
                messageInput.length > 0 && "border-white/40 shadow-sm",
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white/60 text-sm">
              Press Enter to send • Shift+Enter for new line
              {messageInput.length > 0 && <span className="ml-2 text-white/40">({messageInput.length} chars)</span>}
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || isSending}
              className={cn(
                "bg-white/20 hover:bg-white/30 text-white border-0 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
                isSending && "animate-pulse",
              )}
            >
              <Send className={cn("w-4 h-4 mr-2", isSending && "animate-spin")} />
              {isSending ? "Sending..." : "Send"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Statistics */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-2xl font-bold text-white animate-pulse">{messages.length}</p>
              <p className="text-white/60 text-sm">Total Messages</p>
            </div>
            <div className="transition-all duration-300 hover:scale-105">
              <p className="text-2xl font-bold text-white">{members.length}</p>
              <p className="text-white/60 text-sm">Active Members</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
