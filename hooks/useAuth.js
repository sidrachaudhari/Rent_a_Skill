"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { createUser, UserTypes, ProfileTypes } from "../types/index.js"
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            // Fetch user profile from our 'users' table
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (error) {
              console.error('Error fetching user profile:', error.message || error)
              // For development, create a mock user profile if the table doesn't exist
              if (error.code === 'PGRST116' || error.message?.includes('relation "users" does not exist')) {
                console.warn('Users table does not exist. Using mock user profile for development.')
                const mockUser = {
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  email: session.user.email,
                  avatar_url: "/placeholder.svg",
                  user_type: "seeker",
                  profile_type: "student",
                  bio: "",
                  college: "",
                  company: "",
                  hourly_rate: 0,
                  phone: "",
                  location: "",
                  is_verified: false,
                  rating: 0,
                  total_reviews: 0,
                  completed_tasks: 0,
                  total_earnings: 0,
                  available_balance: 0,
                  is_available: true,
                  notification_preferences: {},
                }
                setUser(mockUser)
              } else {
                setUser(null)
              }
            } else if (data) {
              setUser(data)
            }
          } catch (err) {
            console.error('Unexpected error fetching user profile:', err.message || err)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    )

    // Initial check for session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) {
              console.error('Error fetching initial user profile:', error.message || error)
              // For development, create a mock user profile if the table doesn't exist
              if (error.code === 'PGRST116' || error.message?.includes('relation "users" does not exist')) {
                console.warn('Users table does not exist. Using mock user profile for development.')
                const mockUser = {
                  id: session.user.id,
                  name: session.user.email?.split('@')[0] || 'User',
                  email: session.user.email,
                  avatar_url: "/placeholder.svg",
                  user_type: "seeker",
                  profile_type: "student",
                  bio: "",
                  college: "",
                  company: "",
                  hourly_rate: 0,
                  phone: "",
                  location: "",
                  is_verified: false,
                  rating: 0,
                  total_reviews: 0,
                  completed_tasks: 0,
                  total_earnings: 0,
                  available_balance: 0,
                  is_available: true,
                  notification_preferences: {},
                }
                setUser(mockUser)
              } else {
                setUser(null)
              }
            } else if (data) {
              setUser(data)
            }
          })
          .catch((err) => {
            console.error('Unexpected error fetching initial user profile:', err.message || err)
            setUser(null)
          })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      throw error
    }
    // User data will be set by onAuthStateChange listener
    return data.user
  }

  const register = async (userData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    })

    if (authError) {
      throw authError
    }

    if (authData.user) {
      const newUserProfile = {
        id: authData.user.id,
        name: userData.name || "",
        email: userData.email || "",
        avatar_url: "/placeholder.svg", // Use avatar_url to match DB schema
        user_type: userData.type || UserTypes.SEEKER, // Use user_type to match DB schema
        profile_type: userData.profileType || ProfileTypes.STUDENT, // Use profile_type to match DB schema
        bio: userData.bio || "",
        college: userData.college || "",
        company: userData.company || "",
        hourly_rate: userData.hourlyRate || 0, // Use hourly_rate to match DB schema
        phone: userData.phone || "",
        location: userData.location || "",
        is_verified: false,
        rating: 0,
        total_reviews: 0,
        completed_tasks: 0,
        total_earnings: 0,
        available_balance: 0,
        is_available: true,
        notification_preferences: {},
      }

      try {
        const { data, error } = await supabase.from('users').insert([newUserProfile])

        if (error) {
          // If profile insertion fails, consider rolling back auth user or handling
          console.error('Error inserting user profile:', error.message || error)
          
          // For development, if the table doesn't exist, just return the auth user
          if (error.code === 'PGRST116' || error.message?.includes('relation "users" does not exist')) {
            console.warn('Users table does not exist. Skipping profile creation for development.')
            return authData.user
          }
          
          throw error
        }
        // User data will be set by onAuthStateChange listener
        return data
      } catch (err) {
        console.error('Unexpected error inserting user profile:', err.message || err)
        // For development, if there's any error, just return the auth user
        return authData.user
      }
    }
    return null
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message || error)
      throw error
    }
    setUser(null)
  }

  const updateUser = async (userData) => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', user.id)
        .select() // Select the updated data

      if (error) {
        console.error('Error updating user profile:', error.message || error)
        throw error
      }
      if (data && data.length > 0) {
        setUser(data[0]) // Update local state with the latest data from DB
      }
    }
  }

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}
