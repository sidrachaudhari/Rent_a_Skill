// User type definitions
export const UserTypes = {
  SEEKER: "seeker",
  PROVIDER: "provider",
  BOTH: "both",
}

export const ProfileTypes = {
  STUDENT: "student",
  GRADUATE: "graduate",
  PROFESSIONAL: "professional",
}

export const TaskStatus = {
  OPEN: "open",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
}

export const TransactionStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
}

// Default user object
export const createUser = (userData = {}) => ({
  id: "",
  name: "",
  email: "",
  avatar: "",
  type: UserTypes.SEEKER,
  profileType: ProfileTypes.STUDENT,
  skills: [],
  rating: 0,
  completedTasks: 0,
  totalEarnings: 0,
  availableBalance: 0,
  isVerified: false,
  college: "",
  company: "",
  bio: "",
  hourlyRate: 0,
  phone: "",
  ...userData,
})

// Default task object
export const createTask = (taskData = {}) => ({
  id: "",
  title: "",
  description: "",
  category: "",
  budget: 0,
  deadline: "",
  status: TaskStatus.OPEN,
  seekerId: "",
  providerId: "",
  createdAt: "",
  isUrgent: false,
  voiceNote: "",
  requirements: [],
  ...taskData,
})

// Default skill object
export const createSkill = (skillData = {}) => ({
  id: "",
  name: "",
  category: "",
  averagePrice: 0,
  providers: 0,
  rating: 0,
  isPopular: false,
  ...skillData,
})

// Default transaction object
export const createTransaction = (transactionData = {}) => ({
  id: "",
  taskId: "",
  amount: 0,
  status: TransactionStatus.PENDING,
  paymentMethod: "",
  createdAt: "",
  ...transactionData,
})
