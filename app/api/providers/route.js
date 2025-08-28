import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const skillQuery = searchParams.get('skillQuery')
    const maxRate = searchParams.get('maxRate')

    let dbQuery = supabase
      .from('users')
      .select('*')
      .or('user_type.eq.provider,user_type.eq.both') // Filter for providers or both

    if (skillQuery) {
      // Search in skills column (assuming it's a text field with comma-separated skills)
      dbQuery = dbQuery.ilike('skills', `%${skillQuery}%`)
    }
    if (maxRate) {
      dbQuery = dbQuery.lte('hourly_rate', parseFloat(maxRate))
    }

    const { data, error } = await dbQuery

    if (error) {
      console.error('Database error:', error.message || error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Unexpected error:', err.message || err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}