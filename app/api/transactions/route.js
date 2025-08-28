import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(request) {
  try {
    const {
      task_id,
      payer_id,
      payee_id,
      amount,
      platform_fee,
      net_amount,
      currency = "INR",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      status = "pending",
      payment_method,
      description,
      metadata = {}
    } = await request.json()

    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          task_id,
          payer_id,
          payee_id,
          amount,
          platform_fee,
          net_amount,
          currency,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status,
          payment_method,
          description,
          metadata
        },
      ])
      .select()

    if (error) {
      console.error('Database error:', error.message || error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data[0])
  } catch (err) {
    console.error('Unexpected error:', err.message || err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}