const { createClient } = require('@supabase/supabase-js');
const config = require('./index');

const supabaseUrl = config.supabase.url;
const supabaseAnonKey = config.supabase.anonKey;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Regular client for database operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client for file uploads (bypasses RLS)
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

module.exports = { supabase, supabaseAdmin };