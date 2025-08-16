import { ChatProvider,useChatContext  } from "@/components/chat-provider"
import { ChatInterface } from "@/components/chat-interface"
import { AdminPanel } from "@/components/admin-panel"
import { generateBackgroundStyle  } from "@/components/background-customizer"

export default function Home() {
    const { chatState } = useChatContext()

 

  return (
    <ChatProvider>
      <div
        className="min-h-screen"
          style={generateBackgroundStyle(chatState.background)} // <-- dynamic background
    
      >
        <div className="container mx-auto p-4">
          <div className="grid lg:grid-cols-2 gap-6 h-screen max-h-screen">
            {/* Frontend Chat View */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white mb-4">Group Chat</h1>
              <ChatInterface />
            </div>

            {/* Backend Admin Panel */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white mb-4">Admin Control</h1>
              <AdminPanel />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}
