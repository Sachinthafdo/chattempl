export interface Member {
  id: string
  name: string
  avatar: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
}

export interface BackgroundSettings {
  type: "solid" | "gradient"
  solidColor: string
  solidOpacity: number
  gradientType: "linear" | "radial" | "conic"
  gradientDirection: string
  gradientColors: Array<{
    color: string
    opacity: number
    position: number
  }>
}

export interface ChatState {
  members: Member[]
  messages: Message[]
  currentSender: string
  currentViewer: string // Added currentViewer to separate who is viewing from who is sending
  theme: "rose" | "minimal" | "brown" | "dark" // Brought back theme system for chat bubble styling
  groupName: string
  background: BackgroundSettings
}

export const MEMBERS: Member[] = [
  {
    id: "imandi",
    name: "Imandi",
    avatar: "https://i.ibb.co/Ps7N19K6/Screenshot-2025-08-16-040225.png",
  },
  {
    id: "sandani",
    name: "Sandani",
    avatar: "https://i.ibb.co/tTY7CjXH/Screenshot-2025-08-16-040410.png",
  },
  {
    id: "sachintha",
    name: "Sachintha",
    avatar: "https://i.ibb.co/5xYnR26c/Screenshot-2025-08-16-040021.png",
  },
]
