"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AuthProvider, useAuth } from "../hooks/useAuth.js"
import AuthModal from "../components/AuthModal.jsx"
import TaskPostingModal from "../components/TaskPostingModal.jsx"
import EnhancedDashboard from "../components/EnhancedDashboard.jsx"
import SkillBrowser from "../components/SkillBrowser.jsx"
import {
  Mic,
  Star,
  Clock,
  Shield,
  Zap,
  Users,
  Code,
  Palette,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Menu,
  X,
  GraduationCap,
  Briefcase,
  BookOpen,
} from "lucide-react"

// Wrap the component with AuthProvider
export default function Page() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

// Main content component that uses the auth context
function AppContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const { user, logout } = useAuth()

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const topSkills = [
    {
      title: "Resume Review",
      price: "₹200/hr",
      rating: 4.8,
      reviews: 156,
      category: "Documents",
      urgent: true,
    },
    {
      title: "Python Programming",
      price: "₹400/hr",
      rating: 4.9,
      reviews: 89,
      category: "Coding",
      urgent: true,
    },
    {
      title: "UI/UX Design",
      price: "₹500/hr",
      rating: 4.7,
      reviews: 203,
      category: "Design",
      urgent: false,
    },
    {
      title: "Data Science",
      price: "₹600/hr",
      rating: 4.8,
      reviews: 124,
      category: "Analytics",
      urgent: true,
    },
  ]

  const howItWorksSteps = [
    {
      step: 1,
      title: "Post a task",
      description: "Describe your need via text or voice note",
      icon: <Mic className="w-8 h-8" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      step: 2,
      title: "Match with expert",
      description: "Get matched with verified students, graduates, or professionals",
      icon: <Users className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      step: 3,
      title: "Pay securely & get work done",
      description: "Secure payment with escrow protection and fast delivery",
      icon: <Smartphone className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
    },
  ]

  const userTypes = [
    {
      type: "Students",
      icon: <GraduationCap className="w-8 h-8" />,
      description: "College students earning while studying",
      stats: "10K+ Active",
      color: "bg-blue-100 text-blue-600",
    },
    {
      type: "Graduates",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Recent graduates with fresh skills",
      stats: "5K+ Available",
      color: "bg-green-100 text-green-600",
    },
    {
      type: "Professionals",
      icon: <Briefcase className="w-8 h-8" />,
      description: "Experienced professionals offering expertise",
      stats: "2K+ Experts",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  if (user && activeTab !== "home") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Rent-a-Skill</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`${activeTab === "home" ? "text-purple-600" : "text-gray-600"} hover:text-purple-600 transition-colors`}
                >
                  Home
                </button>
                <button
                  onClick={() => setActiveTab("browse")}
                  className={`${activeTab === "browse" ? "text-purple-600" : "text-gray-600"} hover:text-purple-600 transition-colors`}
                >
                  Browse Skills
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`${activeTab === "dashboard" ? "text-purple-600" : "text-gray-600"} hover:text-purple-600 transition-colors`}
                >
                  Dashboard
                </button>
              </nav>

              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setTaskModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 hidden sm:flex"
                >
                  Post Task
                </Button>
                <div className="flex items-center space-x-2">
                  <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </div>
                <Button variant="ghost" onClick={logout} className="text-gray-600">
                  Logout
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t bg-white py-4">
                <nav className="flex flex-col space-y-4">
                  <button
                    onClick={() => {
                      setActiveTab("home")
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-purple-600"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("browse")
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-purple-600"
                  >
                    Browse Skills
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("dashboard")
                      setMobileMenuOpen(false)
                    }}
                    className="text-left text-gray-600 hover:text-purple-600"
                  >
                    Dashboard
                  </button>
                  <Button
                    onClick={() => {
                      setTaskModalOpen(true)
                      setMobileMenuOpen(false)
                    }}
                    className="bg-purple-600 hover:bg-purple-700 w-full"
                  >
                    Post Task
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        {activeTab === "browse" && <SkillBrowser />}
        {activeTab === "dashboard" && <EnhancedDashboard />}

        {/* Modals */}
        <TaskPostingModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Rent-a-Skill</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">
                How it Works
              </a>
              <button
                onClick={() => setActiveTab("browse")}
                className="text-gray-600 hover:text-purple-600 transition-colors"
              >
                Browse Skills
              </button>
              <a href="#user-types" className="text-gray-600 hover:text-purple-600 transition-colors">
                Join as Expert
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="flex items-center space-x-2">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-8 h-8 rounded-full" />
                    <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                  </div>
                  <Button onClick={() => setActiveTab("dashboard")} className="bg-purple-600 hover:bg-purple-700">
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={logout} className="text-gray-600">
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="text-gray-600"
                    onClick={() => {
                      setAuthMode("login")
                      setAuthModalOpen(true)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => {
                      setAuthMode("register")
                      setAuthModalOpen(true)
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  🚀 Get expert help in just 1 hour!
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Get Help from <span className="text-yellow-300">Students</span>,{" "}
                  <span className="text-yellow-300">Graduates</span> &{" "}
                  <span className="text-yellow-300">Professionals</span>
                </h1>
                <p className="text-xl text-purple-100 max-w-lg">
                  Connect with verified experts across all skill levels – from talented students to seasoned
                  professionals. Fast, affordable, and reliable.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
                  onClick={() => (user ? setTaskModalOpen(true) : setAuthModalOpen(true))}
                >
                  Find Expert Help
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 font-semibold px-8"
                  onClick={() => {
                    setAuthMode("register")
                    setAuthModalOpen(true)
                  }}
                >
                  Become an Expert
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">17K+</div>
                  <div className="text-purple-200 text-sm">Active Experts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">100K+</div>
                  <div className="text-purple-200 text-sm">Tasks Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9★</div>
                  <div className="text-purple-200 text-sm">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Quick Task Booking</h3>
                    <Badge className="bg-green-500 text-white">Live Demo</Badge>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="E.g., 'Need help with React development'"
                      className="bg-white/20 border-white/30 text-white placeholder:text-white/70 pr-12"
                    />
                    <Button
                      size="sm"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 p-0 ${
                        isRecording ? "bg-red-500 animate-pulse" : "bg-purple-500"
                      }`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Code className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm">Coding</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <Palette className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-sm">Design</div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold hover:from-yellow-500 hover:to-orange-600"
                    onClick={() => (user ? setTaskModalOpen(true) : setAuthModalOpen(true))}
                  >
                    Find Expert Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section id="user-types" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Connect with the Right Expert</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From students earning while studying to seasoned professionals sharing expertise
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div
                    className={`w-16 h-16 rounded-full ${userType.color} flex items-center justify-center mx-auto mb-6`}
                  >
                    {userType.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{userType.type}</h3>
                  <p className="text-gray-600 mb-4">{userType.description}</p>
                  <Badge variant="outline" className="mb-4">
                    {userType.stats}
                  </Badge>
                  <div className="space-y-2 text-sm text-gray-500">
                    {userType.type === "Students" && (
                      <>
                        <div>• Affordable rates (₹200-500/hr)</div>
                        <div>• Fresh perspectives</div>
                        <div>• Quick turnaround</div>
                      </>
                    )}
                    {userType.type === "Graduates" && (
                      <>
                        <div>• Competitive rates (₹400-700/hr)</div>
                        <div>• Latest skills & trends</div>
                        <div>• Eager to build portfolio</div>
                      </>
                    )}
                    {userType.type === "Professionals" && (
                      <>
                        <div>• Premium expertise (₹600-1500/hr)</div>
                        <div>• Industry experience</div>
                        <div>• Complex project handling</div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get expert help or start earning in just 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <Card className="h-full border-2 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}
                    >
                      {step.icon}
                    </div>
                    <div className="mb-4">
                      <Badge variant="outline" className="mb-2">
                        Step {step.step}
                      </Badge>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-purple-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Skills Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Skills</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our most requested skills with verified experts ready to help
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topSkills.map((skill, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {skill.category}
                    </Badge>
                    {skill.urgent && (
                      <Badge className="bg-red-500 text-white text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        1-Hour
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                    {skill.title}
                  </h3>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{skill.rating}</span>
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({skill.reviews} reviews)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">{skill.price}</div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => (user ? setActiveTab("browse") : setAuthModalOpen(true))}
                    >
                      Hire Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-600 hover:bg-purple-50"
              onClick={() => setActiveTab("browse")}
            >
              View All Skills
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Safe, Secure & Reliable</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Escrow Protection</h3>
                    <p className="text-gray-600">
                      Payment held securely with Razorpay until task completion. Full refund if unsatisfied.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Verified Experts</h3>
                    <p className="text-gray-600">
                      All experts verified through ID, degree certificates, and skill assessments.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                    <p className="text-gray-600">Most urgent tasks completed within 1 hour with quality guarantee.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">Secure Payments</h4>
                    <Badge className="bg-green-500">Razorpay Secured</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
                      <div className="text-sm font-medium">Cards</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2"></div>
                      <div className="text-sm font-medium">UPI</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-purple-600 rounded mx-auto mb-2"></div>
                      <div className="text-sm font-medium">Net Banking</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-8 h-8 bg-orange-600 rounded mx-auto mb-2"></div>
                      <div className="text-sm font-medium">Wallets</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students, graduates, and professionals already earning and learning on Rent-a-Skill. Your
            next opportunity is just one click away!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
              onClick={() => {
                setAuthMode("register")
                setAuthModalOpen(true)
              }}
            >
              Start Earning Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 font-semibold px-8"
              onClick={() => (user ? setTaskModalOpen(true) : setAuthModalOpen(true))}
            >
              Post Your First Task
            </Button>
          </div>

          <p className="text-purple-200 text-sm mt-6">No signup fees • Secure payments • 24/7 support</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Rent-a-Skill</span>
              </div>
              <p className="text-gray-400 mb-4">
                Connect with verified experts across all skill levels for fast, reliable help.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.63c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 4.041v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">For Experts</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Start Earning
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Verification Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Expert Resources
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">For Clients</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Post a Task
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Browse Experts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Client Guarantees
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety & Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">&copy; 2024 Rent-a-Skill. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg?height=30&width=80" alt="Razorpay" className="h-6" />
              <img src="/placeholder.svg?height=30&width=80" alt="Secure Payment" className="h-6" />
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authMode} />
      <TaskPostingModal isOpen={taskModalOpen} onClose={() => setTaskModalOpen(false)} />
    </div>
  )
}
