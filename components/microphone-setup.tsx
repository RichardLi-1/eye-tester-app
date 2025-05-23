"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface MicrophoneSetupProps {
  onPermissionGranted: () => void
}

export default function MicrophoneSetup({ onPermissionGranted }: MicrophoneSetupProps) {
  const [permissionStatus, setPermissionStatus] = useState<"prompt" | "granted" | "denied">("prompt")
  const [error, setError] = useState<string | null>(null)

  const requestPermission = async () => {
    try {
      console.log("Requesting microphone permission...")
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      console.log("Permission granted, stopping stream...")
      stream.getTracks().forEach(track => track.stop()) // Stop the stream after getting permission
      console.log("Setting permission status to granted...")
      setPermissionStatus("granted")
      onPermissionGranted()
    } catch (err) {
      console.error("Microphone permission error:", err)
      setPermissionStatus("denied")
      setError("Please allow microphone access in your browser settings to continue.")
    }
  }

  useEffect(() => {
    // Only check permission status on mount
    const checkPermission = async () => {
      try {
        console.log("Checking initial microphone permission...")
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach(track => track.stop())
        console.log("Initial permission already granted...")
        setPermissionStatus("granted")
        onPermissionGranted()
      } catch (err) {
        console.log("Initial permission not granted:", err)
        // Don't set error here, just set status to prompt
        setPermissionStatus("prompt")
      }
    }

    checkPermission()
  }, [onPermissionGranted])

  if (permissionStatus === "granted") {
    return (
      <div className="flex items-center justify-center space-x-2 text-[#12B76A]">
        <Mic className="h-5 w-5" />
        <span className="text-[14px] font-medium">Microphone Ready</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <Button
          onClick={requestPermission}
          className="bg-[#6B2FFA] hover:bg-[#5925D9] text-white rounded-lg px-6 py-3 text-[14px] font-medium transition-all duration-200"
        >
          <Mic className="mr-2 h-4 w-4" />
          Enable Microphone
        </Button>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <p className="text-[14px] text-[#666666] text-center">
          {permissionStatus === "denied" 
            ? "Please enable microphone access in your browser settings and refresh the page."
            : "Click to enable your microphone for the vision test."}
        </p>
      </div>
    </div>
  )
} 