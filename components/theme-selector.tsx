"use client"

import { useChatContext } from "./chat-provider"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Palette } from "lucide-react"
import { cn } from "@/lib/utils"

const themes = [
  {
    id: "rose" as const,
    name: "Rose Neon",
    description: "Rose + Purple with neon glow",
    preview: "bg-gradient-to-r from-rose-500 to-purple-600",
    glowClass: "shadow-rose-500/50",
  },
  {
    id: "minimal" as const,
    name: "Minimal",
    description: "Clean and simple",
    preview: "bg-gradient-to-r from-gray-100 to-gray-200",
    glowClass: "shadow-gray-300/30",
  },
  {
    id: "brown" as const,
    name: "Warm Earth",
    description: "Off-white + Brown tones",
    preview: "bg-gradient-to-r from-amber-100 to-stone-400",
    glowClass: "shadow-amber-300/40",
  },
  {
    id: "dark" as const,
    name: "Dark Mode",
    description: "Black + White contrast",
    preview: "bg-gradient-to-r from-gray-800 to-black",
    glowClass: "shadow-gray-700/50",
  },
]

export function ThemeSelector() {
  const { chatState, setTheme } = useChatContext()
  const { theme } = chatState

  return (
    <Card className="bg-white/5 backdrop-blur-md border-white/10">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Chat Themes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              onClick={() => setTheme(themeOption.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02]",
                "border backdrop-blur-md",
                theme === themeOption.id
                  ? "bg-white/10 border-white/30 shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-white/8",
              )}
            >
              {/* Theme Preview */}
              <div
                className={cn(
                  "w-full h-8 rounded-lg border border-white/20",
                  themeOption.preview,
                  theme === themeOption.id && `shadow-lg ${themeOption.glowClass}`,
                )}
              />

              {/* Theme Info */}
              <div className="text-center">
                <p className="text-white font-medium text-sm">{themeOption.name}</p>
                <p className="text-white/60 text-xs">{themeOption.description}</p>
              </div>

              {/* Active Badge */}
              {theme === themeOption.id && (
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">Active</Badge>
              )}
            </button>
          ))}
        </div>

        {/* Current Theme Display */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-sm">Current Theme:</span>
            <span className="text-white font-medium">{themes.find((t) => t.id === theme)?.name || "Rose Neon"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
