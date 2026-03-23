import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: drivers, error: err1 } = await supabase.from('drivers').select('*').limit(1);
  console.log('drivers sample:', drivers, err1);

  const { data: routeAssignments, error: err2 } = await supabase.from('route_assignments').select('*').limit(1);
  console.log('route_assignments sample:', routeAssignments, err2);
}

check();
