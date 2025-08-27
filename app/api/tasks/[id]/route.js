import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function PUT(request, { params }) {
  const { id } = params
  const updates = await request.json()

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}