const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Setup Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SOURCE_DIR = 'D:\\Biswadeep';
const TARGET_DIR = path.join(__dirname, '..', 'public', 'vault');

// Ensure target directory exists
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// Map filename keywords to categories and issuers
function determineMetadata(filename) {
  const lower = filename.toLowerCase();
  let issuer = "Other";
  let category = "other";
  
  if (lower.includes('claude') || lower.includes('anthropic') || lower.includes('mcp')) {
    issuer = "Anthropic";
    category = "anthropic";
  } else if (lower.includes('google')) {
    issuer = "Google";
    category = "google_skill_badge";
  } else if (lower.includes('ai fluency')) {
    issuer = "AI Fluency";
    category = "ai_fluency";
  } else if (lower.includes('deeplearning')) {
    issuer = "DeepLearning.AI";
    category = "deeplearning";
  }
  
  // Clean up title
  const title = filename.replace('.pdf', '')
                        .replace(/^[a-z]/, (m) => m.toUpperCase())
                        .replace(/[_-]/g, ' ');
  
  return { title, issuer, category };
}

async function ingest() {
  const files = fs.readdirSync(SOURCE_DIR);
  let totalVaulted = 0;

  // First, completely empty fallback DB
  console.log("Wiping existing DB placeholders to avoid duplicates...");
  await supabase.from('certificates').delete().neq('id', 'dummy'); 

  for (const file of files) {
    if (file.toLowerCase().endsWith('.pdf')) {
      const sourcePath = path.join(SOURCE_DIR, file);
      const targetPath = path.join(TARGET_DIR, file);
      
      // 1. Copy file to public/vault
      fs.copyFileSync(sourcePath, targetPath);
      
      // 2. Generate Metadata
      const { title, issuer, category } = determineMetadata(file);
      
      // 3. Insert precisely into Supabase
      const { error } = await supabase.from('certificates').insert({
        title,
        issuer,
        category,
        date_earned: new Date().toISOString().substring(0, 7), // YYYY-MM
        credential_url: `/vault/${encodeURIComponent(file)}`, // Dynamic browser link
        description: `Official certification by ${issuer} for ${title}.`,
      });

      if (error) {
        console.error(`Failed to insert ${file}:`, error.message);
      } else {
        console.log(`✅ Vaulted: ${title} [${issuer}] -> /vault/${file}`);
        totalVaulted++;
      }
    }
  }

  console.log(`\n🎉 Ingestion Complete! Successfully vaulted ${totalVaulted} certificates into the Nexus.`);
}

ingest();
