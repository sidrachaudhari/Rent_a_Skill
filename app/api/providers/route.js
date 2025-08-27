import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const skillQuery = searchParams.get('skillQuery')
  const maxRate = searchParams.get('maxRate')

  let dbQuery = supabase
    .from('users')
    .select('*')
    .or('user_type.eq.provider,user_type.eq.both') // Filter for providers or both

  if (skillQuery) {
    // This assumes skills are stored as an array of strings in the 'skills' column
    // You might need to adjust this if your 'user_skills' table is used for this
    dbQuery = dbQuery.contains('skills', [skillQuery])
  }
  if (maxRate) {
    dbQuery = dbQuery.lte('hourly_rate', parseFloat(maxRate))
  }

  const { data, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}