import { useState } from "react"
import { loadRazorpay, createRazorpayOrder, verifyPayment } from "../lib/razorpay.js"
import { useAuth } from "./useAuth.js"
import { useDatabase } from "./useDatabase.js" // Import useDatabase

export const usePayment = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { createTransaction } = useDatabase() // Get createTransaction from useDatabase

  const processPayment = async (amount, taskId, providerId, onSuccess, onError) => {
    if (!user) {
      onError && onError("User not authenticated")
      return
    }

    setLoading(true)

    try {
      // Load Razorpay script
      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        throw new Error("Failed to load Razorpay")
      }

      // Create order
      const orderData = await createRazorpayOrder(amount)

      // Calculate platform fee (5% of transaction)
      const platformFee = Math.round(amount * 0.05)
      const netAmount = amount - platformFee

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Rent-a-Skill",
        description: `Payment for Task #${taskId}`,
        order_id: orderData.order_id,
        handler: async (response) => {
          try {
            // Verify payment
            const verificationResult = await verifyPayment(response)

            if (verificationResult.success) {
              console.log("Payment successful:", {
                taskId,
                providerId,
                amount,
                platformFee,
                netAmount,
                paymentId: response.razorpay_payment_id,
              })

              // Record transaction in database
              await createTransaction({
                task_id: taskId,
                payer_id: user.id,
                payee_id: providerId,
                amount: amount,
                platform_fee: platformFee,
                net_amount: netAmount,
                currency: orderData.currency,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                status: "completed", // Assuming payment success means transaction completed
                payment_method: "Razorpay",
                description: `Payment for task ${taskId}`,
              })

              onSuccess && onSuccess(response.razorpay_payment_id)
            } else {
              throw new Error("Payment verification failed")
            }
          } catch (error) {
            console.error("Payment verification error:", error)
            onError && onError("Payment verification failed")
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "", // Use user.phone to match DB schema
        },
        theme: {
          color: "#6C63FF",
        },
        modal: {
          ondismiss: () => {
            onError && onError("Payment cancelled by user")
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Payment error:", error)
      onError && onError("Failed to initiate payment")
    } finally {
      setLoading(false)
    }
  }

  const processWithdrawal = async (amount, withdrawalMethod, accountDetails, onSuccess, onError) => {
    if (!user) {
      onError && onError("User not authenticated")
      return
    }

    setLoading(true)

    try {
      // Simulate withdrawal processing
      // In a real app, this would call an API route to record the withdrawal and update user balance
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Withdrawal processed:", {
        userId: user.id,
        amount,
        withdrawalMethod,
        accountDetails,
      })

      // Here, you would typically call an API to create a withdrawal record in your database
      // and update the user's available_balance.
      // For now, we'll just simulate success.

      onSuccess && onSuccess()
    } catch (error) {
      console.error("Withdrawal error:", error)
      onError && onError("Failed to process withdrawal")
    } finally {
      setLoading(false)
    }
  }

  return {
    processPayment,
    processWithdrawal,
    loading,
  }
}
