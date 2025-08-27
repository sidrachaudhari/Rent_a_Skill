import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(request) {
  const {
    taskId,
    payerId,
    payeeId,
    amount,
    platformFee,
    netAmount,
    currency,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    status,
    paymentMethod,
    description,
    metadata
  } = await request.json()

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        task_id: taskId,
        payer_id: payerId,
        payee_id: payeeId,
        amount,
        platform_fee: platformFee,
        net_amount: netAmount,
        currency,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        status,
        payment_method: paymentMethod,
        description,
        metadata
      },
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}