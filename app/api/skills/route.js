import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')
  const category = searchParams.get('category')
  const maxPrice = searchParams.get('maxPrice')

  let dbQuery = supabase.from('skills').select('*')

  if (query) {
    dbQuery = dbQuery.ilike('name', `%${query}%`)
  }
  if (category) {
    dbQuery = dbQuery.eq('category', category)
  }
  if (maxPrice) {
    dbQuery = dbQuery.lte('average_price', parseFloat(maxPrice))
  }

  const { data, error } = await dbQuery

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}