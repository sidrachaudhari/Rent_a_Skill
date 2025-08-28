import { useState, useEffect } from "react" // Ensure useState and useEffect are imported
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { useDatabase } from "@/hooks/useDatabase"
import { Clock, DollarSign, Star, MessageCircle, CheckCircle, AlertCircle } from "lucide-react"

export default function Dashboard() {
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
  }, [user, getTasksByUser]) // Re-fetch when user changes or getTasksByUser reference changes

  if (!user) return null

  const handleAcceptTask = async (taskId) => { // Made async
    try {
      await updateTask(taskId, {
        status: "assigned",
        provider_id: user.id, // Use provider_id to match DB schema
      })
      // Re-fetch tasks to update the UI
      const fetchedSeekerTasks = await getTasksByUser(user.id, "seeker")
      setSeekerTasks(fetchedSeekerTasks)
      const fetchedProviderTasks = await getTasksByUser(user.id, "provider")
      setProviderTasks(fetchedProviderTasks)
    } catch (err) {
      console.error("Failed to accept task:", err)
      // Optionally show an error message to the user
    }
  }

  const handleCompleteTask = async (taskId, budget) => { // Made async
    try {
      await updateTask(taskId, { status: "completed" })
      await createTransaction({
        task_id: taskId, // Use task_id to match DB schema
        amount: budget,
        status: "completed",
        payment_method: "UPI", // Use payment_method to match DB schema
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        Loading tasks...
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
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                {/* Use user.total_earnings from DB */}
                <p className="text-2xl font-bold text-gray-900">₹{(user.total_earnings || 0).toLocaleString()}</p>
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
                {/* Use user.completed_tasks from DB */}
                <p className="text-2xl font-bold text-gray-900">{user.completed_tasks || 0}</p>
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
                {/* Use user.rating from DB */}
                <p className="text-2xl font-bold text-gray-900">{(user.rating || 0).toFixed(1)}★</p>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Management */}
      <Tabs defaultValue="posted" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posted">Tasks I Posted</TabsTrigger>
          <TabsTrigger value="working">Tasks I'm Working On</TabsTrigger>
        </TabsList>

        <TabsContent value="posted" className="space-y-4">
          {seekerTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks posted yet</h3>
                <p className="text-gray-600">Start by posting your first task to get help from skilled students.</p>
              </CardContent>
            </Card>
          ) : (
            seekerTasks.map((task) => (
              <Card key={task.id}>
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
              <Card key={task.id}>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
