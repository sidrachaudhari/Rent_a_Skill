"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "../hooks/useAuth.js"
import { useDatabase } from "../hooks/useDatabase.js"
import { X, Mic, MicOff, Play, Pause, Loader2 } from "lucide-react"

export default function TaskPostingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Coding",
    budget: [300],
    deadline: "1",
    isUrgent: false,
    requirements: "",
  })

  const { user } = useAuth()
  const { createTask } = useDatabase()

  if (!isOpen || !user) return null

  const categories = ["Coding", "Design", "Documents", "Analytics", "Writing", "Other"]

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      setHasRecording(true)
      // Simulate voice-to-text conversion
      setTimeout(() => {
        setFormData({
          ...formData,
          description:
            "I need help debugging my Python code. There's an error in my sorting algorithm that I can't figure out. It should sort a list of numbers but it's not working correctly.",
        })
      }, 1000)
    } else {
      setIsRecording(true)
      setHasRecording(false)
    }
  }

  const handlePlayRecording = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      await createTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        budget: formData.budget[0],
        deadline: new Date(Date.now() + Number.parseInt(formData.deadline) * 60 * 60 * 1000).toISOString(),
        seeker_id: user.id, // Changed to seeker_id
        is_urgent: formData.isUrgent, // Changed to is_urgent
        requirements: formData.requirements.split("\n").filter((r) => r.trim()),
      })

      onClose()
      setStep(1)
      setFormData({
        title: "",
        description: "",
        category: "Coding",
        budget: [300],
        deadline: "1",
        isUrgent: false,
        requirements: "",
      })
    } catch (error) {
      console.error("Task creation error:", error)
      // Optionally show an error message to the user
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Post a New Task</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">How would you like to describe your task?</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setStep(2)}
                  >
                    <Mic className="w-8 h-8 mb-2" />
                    Voice Note
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setStep(3)}
                  >
                    <div className="w-8 h-8 mb-2 flex items-center justify-center">✍️</div>
                    Type Details
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Record your task description</h3>

                <div className="bg-gray-50 rounded-lg p-8 mb-4">
                  <Button
                    size="lg"
                    className={`w-20 h-20 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-purple-600"}`}
                    onClick={handleVoiceRecord}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </Button>

                  {isRecording && (
                    <div className="mt-4">
                      <div className="flex justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-red-500 rounded animate-pulse"
                            style={{
                              height: Math.random() * 20 + 10,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Recording... Tap to stop</p>
                    </div>
                  )}

                  {hasRecording && !isRecording && (
                    <div className="mt-4">
                      <Button variant="outline" onClick={handlePlayRecording}>
                        {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                        {isPlaying ? "Playing..." : "Play Recording"}
                      </Button>
                    </div>
                  )}
                </div>

                {formData.description && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">AI Generated Summary:</h4>
                    <p className="text-sm text-gray-700">{formData.description}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)} disabled={!formData.description} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Fix Python sorting algorithm bug"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you need help with..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label>Category</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={formData.category === category ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInputChange("category", category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Budget: ₹{formData.budget[0]}</Label>
                <Slider
                  value={formData.budget}
                  onValueChange={(value) => handleInputChange("budget", value)}
                  max={1000}
                  min={100}
                  step={50}
                  className="mt-2"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>₹100</span>
                  <span>₹1000</span>
                </div>
              </div>

              <div>
                <Label>Deadline</Label>
                <div className="flex gap-2 mt-2">
                  {["1", "3", "6", "24"].map((hours) => (
                    <Badge
                      key={hours}
                      variant={formData.deadline === hours ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleInputChange("deadline", hours)}
                    >
                      {hours} hour{hours !== "1" ? "s" : ""}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Requirements (optional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Any specific requirements or deliverables..."
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(step === 3 && !formData.description ? 1 : 2)}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.description || loading}
                  className="flex-1"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Post Task
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
