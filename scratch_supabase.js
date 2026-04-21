import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testStorage() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Storage Error:", error);
  } else {
    console.log("Buckets:", data);
  }
}
testStorage();
