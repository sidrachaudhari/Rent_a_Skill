"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePayment } from "../hooks/usePayment.js"
import { useAuth } from "../hooks/useAuth.js"
import { X, CreditCard, Smartphone, CheckCircle, Loader2 } from "lucide-react"

export default function WithdrawalModal({ isOpen, onClose, availableBalance }) {
  const [withdrawalMethod, setWithdrawalMethod] = useState("upi")
  const [amount, setAmount] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
  })
  const [upiId, setUpiId] = useState("")
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false)

  const { processWithdrawal, loading } = usePayment()
  const { user } = useAuth()

  if (!isOpen) return null

  const withdrawalAmount = Number.parseFloat(amount) || 0
  const processingFee = Math.max(withdrawalAmount * 0.02, 10) // 2% or minimum ₹10
  const netAmount = withdrawalAmount - processingFee

  const handleWithdrawal = () => {
    const accountDetails =
      withdrawalMethod === "bank_transfer"
        ? bankDetails
        : {
            upiId,
          }

    processWithdrawal(
      withdrawalAmount,
      withdrawalMethod,
      accountDetails,
      () => {
        setWithdrawalSuccess(true)
      },
      (error) => {
        console.error("Withdrawal failed:", error)
      },
    )
  }

  const isFormValid = () => {
    if (!amount || withdrawalAmount <= 0 || withdrawalAmount > availableBalance) return false

    if (withdrawalMethod === "bank_transfer") {
      return bankDetails.accountNumber && bankDetails.ifscCode && bankDetails.accountHolderName
    } else {
      return upiId
    }
  }

  const handleBankDetailsChange = (field, value) => {
    setBankDetails({ ...bankDetails, [field]: value })
  }

  if (withdrawalSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Withdrawal Initiated!</h3>
            <p className="text-gray-600 mb-4">
              Your withdrawal request for ₹{netAmount} has been submitted. It will be processed within 1-2 business
              days.
            </p>
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
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Withdraw Earnings</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Balance */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600">Available Balance</div>
            <div className="text-2xl font-bold text-purple-900">₹{availableBalance.toLocaleString()}</div>
          </div>

          {/* Withdrawal Amount */}
          <div>
            <Label htmlFor="amount">Withdrawal Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={availableBalance}
            />
            {withdrawalAmount > availableBalance && (
              <p className="text-sm text-red-600 mt-1">Amount exceeds available balance</p>
            )}
          </div>

          {/* Fee Breakdown */}
          {withdrawalAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Withdrawal Amount</span>
                <span>₹{withdrawalAmount}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Processing Fee</span>
                <span>-₹{processingFee}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>You'll Receive</span>
                <span>₹{netAmount}</span>
              </div>
            </div>
          )}

          {/* Withdrawal Method */}
          <Tabs value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upi" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                UPI
              </TabsTrigger>
              <TabsTrigger value="bank_transfer" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Bank Transfer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upi" className="space-y-4">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  placeholder="yourname@paytm"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="bank_transfer" className="space-y-4">
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankDetailsChange("accountNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankDetailsChange("ifscCode", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accountHolderName">Account Holder Name</Label>
                <Input
                  id="accountHolderName"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleBankDetailsChange("accountHolderName", e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Processing Time */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-1">Processing Time</h4>
            <p className="text-sm text-blue-700">
              {withdrawalMethod === "upi" ? "UPI transfers: Instant to 2 hours" : "Bank transfers: 1-2 business days"}
            </p>
          </div>

          {/* Withdraw Button */}
          <Button
            onClick={handleWithdrawal}
            disabled={!isFormValid() || loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Withdraw ₹{netAmount || 0}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
