"use client"

import { useState, useEffect } from "react"
import {
  createTask,
  createTransaction,
  TaskStatus,
} from "../types/index.js" // Removed createUser, createSkill, UserTypes, ProfileTypes as they are not directly used here anymore

export const useDatabase = () => {
  const [tasks, setTasks] = useState([])
  const [skills, setSkills] = useState([])
  const [providers, setProviders] = useState([])
  const [transactions, setTransactions] = useState([])

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksRes = await fetch('/api/tasks')
        const tasksData = await tasksRes.json()
        setTasks(tasksData)

        const skillsRes = await fetch('/api/skills')
        const skillsData = await skillsRes.json()
        setSkills(skillsData)

        const providersRes = await fetch('/api/providers')
        const providersData = await providersRes.json()
        setProviders(providersData)

        // Transactions might not be needed on initial load for all users
        // const transactionsRes = await fetch('/api/transactions')
        // const transactionsData = await transactionsRes.json()
        // setTransactions(transactionsData)

      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }
    fetchData()
  }, [])

  const createTaskRecord = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })
      const newTask = await response.json()
      setTasks((prevTasks) => [...prevTasks, newTask])
      return newTask
    } catch (error) {
      console.error("Error creating task:", error)
      throw error
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })
      const updatedTask = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      )
      return updatedTask
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  const createTransactionRecord = async (transactionData) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      })
      const newTransaction = await response.json()
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction])
      return newTransaction
    } catch (error) {
      console.error("Error creating transaction:", error)
      throw error
    }
  }

  const getTasksByUser = async (userId, type) => {
    try {
      const response = await fetch(`/api/tasks?userId=${userId}&type=${type}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching tasks by user:", error)
      return []
    }
  }

  const searchSkills = async (query, category, maxPrice) => {
    try {
      const params = new URLSearchParams()
      if (query) params.append('query', query)
      if (category) params.append('category', category)
      if (maxPrice) params.append('maxPrice', maxPrice)

      const response = await fetch(`/api/skills?${params.toString()}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error searching skills:", error)
      return []
    }
  }

  const searchProviders = async (skillQuery, maxRate) => {
    try {
      const params = new URLSearchParams()
      if (skillQuery) params.append('skillQuery', skillQuery)
      if (maxRate) params.append('maxRate', maxRate)

      const response = await fetch(`/api/providers?${params.toString()}`)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error searching providers:", error)
      return []
    }
  }

  return {
    tasks,
    skills,
    providers,
    transactions,
    createTask: createTaskRecord,
    updateTask,
    createTransaction: createTransactionRecord,
    getTasksByUser,
    searchSkills,
    searchProviders,
  }
}
