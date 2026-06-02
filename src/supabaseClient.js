import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eihwduksmwsghftlgdmq.supabase.co'
const supabaseKey = 'sb_publishable_WxwZZGV7IL4Gd-eowVMviw_zWiJfBmP'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)