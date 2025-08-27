import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type') // 'seeker' or 'provider'

  let query = supabase.from('tasks').select('*')

  if (userId && type) {
    if (type === 'seeker') {
      query = query.eq('seeker_id', userId)
    } else if (type === 'provider') {
      query = query.eq('provider_id', userId)
    }
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request) {
  const {
    title,
    description,
    category,
    budget,
    deadline,
    seekerId,
    isUrgent,
    requirements,
    voice_note_url,
    attachment_urls
  } = await request.json()

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title,
        description,
        category,
        budget,
        deadline,
        seeker_id: seekerId, // Match DB schema
        is_urgent: isUrgent, // Match DB schema
        requirements,
        voice_note_url,
        attachment_urls
      },
    ])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data[0])
}