"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "../hooks/useAuth.js"
import { UserTypes, ProfileTypes } from "../types/index.js"
import { X, Loader2 } from "lucide-react"

export default function AuthModal({ isOpen, onClose, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null) // New state for error messages
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Ensure password is part of formData
    type: UserTypes.SEEKER,
    profileType: ProfileTypes.STUDENT,
    college: "",
    company: "",
    skills: "",
    hourlyRate: "",
  })

  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null) // Clear previous errors

    try {
      if (mode === "login") {
        await login(formData.email, formData.password)
      } else {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password, // Pass password for registration
          type: formData.type,
          profileType: formData.profileType,
          college: formData.college,
          company: formData.company,
          skills: formData.skills.split(",").map((s) => s.trim()),
          hourlyRate: formData.hourlyRate ? Number.parseInt(formData.hourlyRate) : undefined,
        })
      }
      onClose() // Only close on success
    } catch (err) {
      console.error("Auth error:", err)
      setError(err.message || "An unexpected error occurred.") // Set error message
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{mode === "login" ? "Login" : "Sign Up"}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && ( // Display error message
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {mode === "register" && (
              <div>Test</div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "login" ? "Login" : "Create Account"}
            </Button>
          </form>

          <div className="text-center mt-4">
            <button
              type="button"
              className="text-purple-600 hover:underline"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
