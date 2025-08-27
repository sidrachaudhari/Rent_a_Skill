"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { usePayment } from "../hooks/usePayment.js"
import { useAuth } from "../hooks/useAuth.js"
import { X, Shield, CreditCard, Smartphone, CheckCircle, Loader2 } from "lucide-react"

export default function PaymentModal({ isOpen, onClose, taskId, providerId, amount, taskTitle, providerName }) {
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [paymentId, setPaymentId] = useState("")
  const { processPayment, loading } = usePayment()
  const { user } = useAuth()

  if (!isOpen) return null

  const platformFee = Math.round(amount * 0.05)
  const totalAmount = amount + platformFee

  const handlePayment = () => {
    processPayment(
      totalAmount,
      taskId,
      providerId,
      (id) => {
        setPaymentId(id)
        setPaymentSuccess(true)
      },
      (error) => {
        console.error("Payment failed:", error)
      },
    )
  }

  if (paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-4">
              Your payment of ₹{totalAmount} has been processed successfully. The provider has been notified and will
              start working on your task.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-600">Payment ID</div>
              <div className="font-mono text-sm">{paymentId}</div>
            </div>
            <Button onClick={onClose} className="w-full">
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Secure Payment</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Task Details */}
          <div className="space-y-3">
            <h3 className="font-semibold">Task Details</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="font-medium text-gray-900">{taskTitle}</div>
              <div className="text-sm text-gray-600">Provider: {providerName}</div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="space-y-3">
            <h3 className="font-semibold">Payment Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Task Amount</span>
                <span>₹{amount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Platform Fee (5%)</span>
                <span>₹{platformFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Escrow Protection */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Escrow Protection</h4>
                <p className="text-sm text-blue-700">
                  Your payment is held securely until the task is completed to your satisfaction.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h3 className="font-semibold">Payment Methods</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border rounded-lg p-3 text-center">
                <CreditCard className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                <div className="text-sm">Cards</div>
              </div>
              <div className="border rounded-lg p-3 text-center">
                <Smartphone className="w-6 h-6 mx-auto mb-1 text-gray-600" />
                <div className="text-sm">UPI</div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <Button onClick={handlePayment} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Pay ₹{totalAmount} Securely
          </Button>

          {/* Security Badge */}
          <div className="text-center">
            <Badge variant="outline" className="text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Secured by Razorpay
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
