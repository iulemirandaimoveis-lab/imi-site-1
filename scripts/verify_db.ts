import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables manually since we might run outside Next.js context
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable() {
    console.log('Checking developments table...')

    // Try to list columns or just select 1 row
    const { data, error } = await supabase
        .from('developments')
        .select('id')
        .limit(1)

    if (error) {
        console.error('Error accessing developments table:', error.message)
        // If table doesn't exist, error might be helpful
        if (error.code === '42P01') { // undefined_table
            console.log('Table developments does NOT exist.')
        }
    } else {
        console.log('Table developments exists and is accessible. Rows returned:', data.length)
    }

    // Check tracked_links too
    const { error: error2 } = await supabase.from('tracked_links').select('id').limit(1)
    if (error2) console.error('Error accessing tracked_links:', error2.message)
    else console.log('tracked_links exists.')
}

checkTable()
