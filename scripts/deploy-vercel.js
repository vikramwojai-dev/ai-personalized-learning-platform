const https = require('https');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_9KXBuoqYkIi7hvR1FiSwx4Oh';

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is required.');
  process.exit(1);
}

function request(url, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      if (typeof data === 'string' || Buffer.isBuffer(data)) {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

async function run() {
  console.log('Fetching user info from Vercel...');
  const userRes = await request('https://api.vercel.com/v2/user', {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  console.log('User:', userRes.data?.user?.username || userRes.data);

  const teamParam = TEAM_ID ? `?teamId=${TEAM_ID}` : '';

  console.log('Fetching projects...');
  const projRes = await request(`https://api.vercel.com/v9/projects${teamParam}`, {
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  });
  console.log('Projects:', projRes.data?.projects?.map(p => ({ id: p.id, name: p.name })));
}

run().catch(console.error);
