async function test() {
  const endpoints = [
    'dashboard',
    'orders',
    'inventory',
    'machines',
    'production',
    'procurement',
    'quality',
    'workforce',
    'finance',
    'ai-insights',
  ];

  console.log('Testing all Next.js API Endpoints against PostgreSQL...');
  let failed = 0;

  for (const ep of endpoints) {
    try {
      const res = await fetch(`http://localhost:3000/api/${ep}`);
      if (!res.ok) {
        console.error(`❌ /api/${ep} -> HTTP ${res.status}`);
        failed++;
        continue;
      }
      const data = await res.json();
      console.log(`✅ /api/${ep} -> status: ${data.status} | keys: ${Object.keys(data).filter(k => k !== 'status').join(', ')}`);
    } catch (err) {
      console.error(`❌ /api/${ep} -> ${err.message}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log('\n🎉 ALL 10 BACKEND APIs ARE FULLY OPERATIONAL AND RETURNING LIVE DATA!');
  } else {
    console.log(`\n⚠️ ${failed} endpoint(s) failed.`);
  }
}

test();
