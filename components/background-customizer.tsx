"use client"

import { useState } from "react"
import { useChatContext } from "./chat-provider"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Palette, Plus, Trash2 } from "lucide-react"
import type { BackgroundSettings } from "@/types/chat"


export const hexToRgba = (hex: string, opacity: number) => {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const generateBackgroundStyle = (bg: BackgroundSettings) => {
  if (bg.type === "solid") {
    return { background: hexToRgba(bg.solidColor, bg.solidOpacity) }
  } else {
    const colors = bg.gradientColors
      .sort((a, b) => a.position - b.position)
      .map((c) => `${hexToRgba(c.color, c.opacity)} ${c.position}%`)
      .join(", ")

    if (bg.gradientType === "linear") {
      return { background: `linear-gradient(${bg.gradientDirection}, ${colors})` }
    } else if (bg.gradientType === "radial") {
      return { background: `radial-gradient(circle, ${colors})` }
    } else {
      return { background: `conic-gradient(${colors})` }
    }
  }
}

export function BackgroundCustomizer() {
  const { chatState, setBackgroundSettings } = useChatContext()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<BackgroundSettings>(chatState.background)

  const gradientDirections = [
    { value: "to-t", label: "To Top" },
    { value: "to-tr", label: "To Top Right" },
    { value: "to-r", label: "To Right" },
    { value: "to-br", label: "To Bottom Right" },
    { value: "to-b", label: "To Bottom" },
    { value: "to-bl", label: "To Bottom Left" },
    { value: "to-l", label: "To Left" },
    { value: "to-tl", label: "To Top Left" },
  ]

 

  const addGradientColor = () => {
    setSettings((prev) => ({
      ...prev,
      gradientColors: [...prev.gradientColors, { color: "#ffffff", opacity: 1, position: 100 }],
    }))
  }

  const removeGradientColor = (index: number) => {
    if (settings.gradientColors.length > 2) {
      setSettings((prev) => ({
        ...prev,
        gradientColors: prev.gradientColors.filter((_, i) => i !== index),
      }))
    }
  }

  const updateGradientColor = (index: number, field: keyof (typeof settings.gradientColors)[0], value: any) => {
    setSettings((prev) => ({
      ...prev,
      gradientColors: prev.gradientColors.map((color, i) => (i === index ? { ...color, [field]: value } : color)),
    }))
  }

  const applySettings = () => {
    setBackgroundSettings(settings)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="backdrop-blur-md bg-white/10 border-white/20 text-white hover:bg-white/20"
      >
        <Palette className="w-4 h-4 mr-2" />
        Background
      </Button>
    )
  }

  return (
    <Card className="backdrop-blur-md bg-white/10 border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          Background Customizer
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm" className="text-white hover:bg-white/20">
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Type */}
        <div>
          <label className="text-sm font-medium mb-2 block">Background Type</label>
          <div className="flex gap-2">
            <Button
              onClick={() => setSettings((prev) => ({ ...prev, type: "solid" }))}
              variant={settings.type === "solid" ? "default" : "outline"}
              size="sm"
              className={settings.type === "solid" ? "bg-white/20" : "bg-white/10 border-white/20 hover:bg-white/20"}
            >
              Solid
            </Button>
            <Button
              onClick={() => setSettings((prev) => ({ ...prev, type: "gradient" }))}
              variant={settings.type === "gradient" ? "default" : "outline"}
              size="sm"
              className={settings.type === "gradient" ? "bg-white/20" : "bg-white/10 border-white/20 hover:bg-white/20"}
            >
              Gradient
            </Button>
          </div>
        </div>

        {/* Solid Color Settings */}
        {settings.type === "solid" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <input
                type="color"
                value={settings.solidColor}
                onChange={(e) => setSettings((prev) => ({ ...prev, solidColor: e.target.value }))}
                className="w-full h-10 rounded border-white/20"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Opacity: {settings.solidOpacity}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.solidOpacity}
                onChange={(e) => setSettings((prev) => ({ ...prev, solidOpacity: Number.parseFloat(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Gradient Settings */}
        {settings.type === "gradient" && (
          <div className="space-y-3">
            {/* Gradient Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Gradient Type</label>
              <div className="flex gap-2">
                {["linear", "radial", "conic"].map((type) => (
                  <Button
                    key={type}
                    onClick={() => setSettings((prev) => ({ ...prev, gradientType: type as any }))}
                    variant={settings.gradientType === type ? "default" : "outline"}
                    size="sm"
                    className={
                      settings.gradientType === type ? "bg-white/20" : "bg-white/10 border-white/20 hover:bg-white/20"
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Direction (for linear gradients) */}
            {settings.gradientType === "linear" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Direction</label>
                <select
                  value={settings.gradientDirection}
                  onChange={(e) => setSettings((prev) => ({ ...prev, gradientDirection: e.target.value }))}
                  className="w-full p-2 rounded bg-white/10 border border-white/20 text-white"
                >
                  {gradientDirections.map((dir) => (
                    <option key={dir.value} value={dir.value} className="bg-gray-800">
                      {dir.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Gradient Colors */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Colors</label>
                <Button
                  onClick={addGradientColor}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="space-y-2">
                {settings.gradientColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-white/5">
                    <input
                      type="color"
                      value={color.color}
                      onChange={(e) => updateGradientColor(index, "color", e.target.value)}
                      className="w-8 h-8 rounded"
                    />
                    <div className="flex-1">
                      <label className="text-xs">Opacity: {color.opacity}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={color.opacity}
                        onChange={(e) => updateGradientColor(index, "opacity", Number.parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="w-16">
                      <label className="text-xs">Pos: {color.position}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={color.position}
                        onChange={(e) => updateGradientColor(index, "position", Number.parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    {settings.gradientColors.length > 2 && (
                      <Button
                        onClick={() => removeGradientColor(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-400/20"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview */}
        <div>
          <label className="text-sm font-medium mb-2 block">Preview</label>
          <div className="w-full h-20 rounded border border-white/20" style={generateBackgroundStyle(settings)} />
        </div>

        {/* Apply Button */}
        <Button onClick={applySettings} className="w-full bg-white/20 hover:bg-white/30 text-white">
          Apply Background
        </Button>
      </CardContent>
    </Card>
  )
}
