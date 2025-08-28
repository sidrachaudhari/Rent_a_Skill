"use client"

import { useState, useEffect } from "react" // Added useEffect
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PaymentModal from "./PaymentModal.jsx"
import WithdrawalModal from "./WithdrawalModal.jsx"
import { useAuth } from "../hooks/useAuth.js"
import { useDatabase } from "../hooks/useDatabase.js"
import { ProfileTypes } from "../types/index.js"
import {
  Clock,
  DollarSign,
  Star,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Wallet,
  Download,
  CreditCard,
} from "lucide-react"

export default function EnhancedDashboard() {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [withdrawalModalOpen, setWithdrawalModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const { user } = useAuth()
  const { getTasksByUser, updateTask, createTransaction } = useDatabase()

  const [seekerTasks, setSeekerTasks] = useState([])
  const [providerTasks, setProviderTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return

      setLoading(true)
      setError(null)
      try {
        const fetchedSeekerTasks = await getTasksByUser(user.id, "seeker")
        setSeekerTasks(fetchedSeekerTasks)

        const fetchedProviderTasks = await getTasksByUser(user.id, "provider")
        setProviderTasks(fetchedProviderTasks)
      } catch (err) {
        console.error("Failed to fetch tasks:", err)
        setError("Failed to load tasks.")
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user, getTasksByUser])

  if (!user) return null

  const handlePayForTask = (task) => {
    setSelectedTask(task)
    setPaymentModalOpen(true)
  }

  const handleCompleteTask = async (taskId, budget) => { // Made async
    try {
      await updateTask(taskId, { status: "completed" })
      await createTransaction({
        task_id: taskId, // Match DB schema
        amount: budget,
        status: "completed",
        payment_method: "UPI", // Match DB schema
        payer_id: user.id, // Assuming the user completing is the payer
        payee_id: user.id, // Assuming the user completing is the payee (this might need adjustment based on actual flow)
        platform_fee: 0, // Placeholder, calculate actual fee
        net_amount: budget, // Placeholder, calculate actual net amount
      })
      // Re-fetch tasks to update the UI
      const fetchedSeekerTasks = await getTasksByUser(user.id, "seeker")
      setSeekerTasks(fetchedSeekerTasks)
      const fetchedProviderTasks = await getTasksByUser(user.id, "provider")
      setProviderTasks(fetchedProviderTasks)
    } catch (err) {
      console.error("Failed to complete task:", err)
      // Optionally show an error message to the user
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "assigned":
        return "bg-yellow-500"
      case "in_progress":
        return "bg-orange-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTimeRemaining = (deadline) => {
    const now = new Date()
    const end = new Date(deadline)
    const diff = end.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (diff <= 0) return "Overdue"
    if (hours === 0) return `${minutes}m left`
    return `${hours}h ${minutes}m left`
  }

  const getProfileTypeDisplay = (profileType) => {
    switch (profileType) {
      case ProfileTypes.STUDENT:
        return "🎓 Student"
      case ProfileTypes.GRADUATE:
        return "👨‍🎓 Graduate"
      case ProfileTypes.PROFESSIONAL:
        return "💼 Professional"
      default:
        return profileType
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar_url || "/placeholder.svg"} // Use avatar_url
              alt={user.name}
              className="w-16 h-16 rounded-full border-4 border-white/20"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <div className="flex items-center space-x-2">
                <Badge className="bg-white/20 text-white">{getProfileTypeDisplay(user.profile_type)}</Badge> {/* Use profile_type */}
                {user.is_verified && <Badge className="bg-green-500">✓ Verified</Badge>} {/* Use is_verified */}
              </div>
              <p className="text-purple-100">{user.college || user.company}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">₹{(user.available_balance || 0).toLocaleString()}</div> {/* Use available_balance */}
            <div className="text-purple-200">Available Balance</div>
            <Button
              variant="outline"
              className="mt-2 border-white text-white hover:bg-white/10"
              onClick={() => setWithdrawalModalOpen(true)}
            >
              <Wallet className="w-4 h-4 mr-2" />
              Withdraw
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{(user.total_earnings || 0).toLocaleString()}</p> {/* Use total_earnings */}
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% this month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{user.completed_tasks || 0}</p> {/* Use completed_tasks */}
                <p className="text-xs text-blue-600">98% success rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="w-8 h-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating</p>
                <p className="text-2xl font-bold text-gray-900">{(user.rating || 0).toFixed(1)}★</p> {/* Use rating */}
                <p className="text-xs text-gray-600">{user.total_reviews || 0} reviews</p> {/* Use total_reviews */}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {[...seekerTasks, ...providerTasks].filter((t) => t.status !== "completed").length}
                </p>
                <p className="text-xs text-purple-600">2 urgent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tasks Management */}
      <Tabs defaultValue="posted" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posted">Tasks I Posted ({seekerTasks.length})</TabsTrigger>
          <TabsTrigger value="working">Tasks I'm Working On ({providerTasks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="space-y-4">
          {seekerTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks posted yet</h3>
                <p className="text-gray-600">
                  Start by posting your first task to get help from skilled professionals.
                </p>
              </CardContent>
            </Card>
          ) : (
            seekerTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                        {task.is_urgent && <Badge variant="destructive">Urgent</Badge>} {/* Use is_urgent */}
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Budget: ₹{task.budget}</span>
                        <span>Category: {task.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeRemaining(task.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      {task.status === "assigned" && (
                        <Button size="sm" onClick={() => handlePayForTask(task)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay Now
                        </Button>
                      )}
                      {task.status === "completed" && <Button size="sm">Rate Provider</Button>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="working" className="space-y-4">
          {providerTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No active tasks</h3>
                <p className="text-gray-600">Browse available tasks to start earning with your skills.</p>
              </CardContent>
            </Card>
          ) : (
            providerTasks.map((task) => (
              <Card key={task.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
                        {task.is_urgent && <Badge variant="destructive">Urgent</Badge>} {/* Use is_urgent */}
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Earn: ₹{task.budget}</span>
                        <span>Category: {task.category}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {getTimeRemaining(task.deadline)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat
                      </Button>
                      {task.status === "assigned" && (
                        <Button size="sm" onClick={() => handleCompleteTask(task.id, task.budget)}>
                          Mark Complete
                        </Button>
                      )}
                      {task.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Payment Modal */}
      {selectedTask && (
        <PaymentModal
          isOpen={paymentModalOpen}
          onClose={() => {
            setPaymentModalOpen(false)
            setSelectedTask(null)
          }}
          taskId={selectedTask.id}
          providerId={selectedTask.provider_id || selectedTask.providerId}
          amount={selectedTask.budget}
          taskTitle={selectedTask.title}
          providerName="Provider Name" // This needs to be fetched from the provider's data
        />
      )}

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={withdrawalModalOpen}
        onClose={() => setWithdrawalModalOpen(false)}
        availableBalance={user.available_balance || 0}
      />
    </div>
  )
}
