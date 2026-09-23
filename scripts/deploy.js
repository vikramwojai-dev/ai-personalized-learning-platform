const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const VERCEL_TOKEN = process.env.VERCEL_TOKEN || process.env.VERCEL_AUTH_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID || 'team_9KXBuoqYkIi7hvR1FiSwx4Oh';
const PROJECT_NAME = process.env.VERCEL_PROJECT_NAME || 'ai-personalized-learning-platform';

if (!VERCEL_TOKEN) {
  console.error('Error: VERCEL_TOKEN environment variable is required.');
  process.exit(1);
}

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  '.npm',
  '.cache',
  '.config',
  'coverage',
  'build',
  'dist',
]);

function computeSha(buffer) {
  return crypto.createHash('sha1').update(buffer).digest('hex');
}

function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  for (const item of list) {
    if (IGNORE_DIRS.has(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, baseDir));
    } else if (stat.isFile()) {
      const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      results.push({ fullPath, relPath, size: stat.size });
    }
  }

  return results;
}

function apiRequest(endpoint, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint.startsWith('http') ? endpoint : `https://api.vercel.com${endpoint}`);
    if (TEAM_ID && !url.searchParams.has('teamId')) {
      url.searchParams.set('teamId', TEAM_ID);
    }

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        ...headers,
      },
    };

    const req = https.request(options, (res) => {
      let chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        try {
          const json = JSON.parse(body.toString());
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: body.toString(), headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      if (Buffer.isBuffer(data) || typeof data === 'string') {
        req.write(data);
      } else {
        req.write(JSON.stringify(data));
      }
    }
    req.end();
  });
}

async function uploadFile(fileObj) {
  const content = fs.readFileSync(fileObj.fullPath);
  const sha = computeSha(content);

  const res = await apiRequest('/v2/files', 'POST', content, {
    'Content-Type': 'application/octet-stream',
    'x-vercel-digest': sha,
    'Content-Length': content.length,
  });

  return { file: fileObj.relPath, sha, size: content.length, mode: 33188 };
}

async function main() {
  console.log('🚀 Starting deployment of SynapseAI to Vercel...');
  const files = getAllFiles('/home/user');
  console.log(`Found ${files.length} project files to deploy.`);

  console.log('Uploading file contents to Vercel...');
  const uploadedManifest = [];
  for (const f of files) {
    const manifestItem = await uploadFile(f);
    uploadedManifest.push(manifestItem);
  }
  console.log('✅ All files uploaded successfully.');

  console.log('Triggering deployment creation...');
  const deployPayload = {
    name: PROJECT_NAME,
    project: PROJECT_NAME,
    files: uploadedManifest,
    target: 'production',
    projectSettings: {
      framework: 'nextjs',
      buildCommand: 'npm run build',
      outputDirectory: null,
      installCommand: 'npm install',
    },
  };

  const createRes = await apiRequest('/v13/deployments', 'POST', deployPayload, {
    'Content-Type': 'application/json',
  });

  if (createRes.status !== 200 && createRes.status !== 201) {
    console.error('Deployment creation failed:', createRes.data || createRes.body);
    process.exit(1);
  }

  const deployment = createRes.data;
  const deploymentId = deployment.id;
  const deploymentUrl = deployment.url;
  console.log(`✅ Deployment initiated: https://${deploymentUrl}`);
  console.log(`Deployment ID: ${deploymentId}`);

  // Poll status
  console.log('Waiting for build to complete...');
  let ready = false;
  let attempts = 0;

  while (!ready && attempts < 40) {
    await new Promise((r) => setTimeout(r, 4000));
    attempts++;

    const statusRes = await apiRequest(`/v13/deployments/${deploymentId}`);
    const state = statusRes.data?.status || statusRes.data?.readyState;
    console.log(`[${attempts * 4}s] Build state: ${state}`);

    if (state === 'READY') {
      ready = true;
      console.log(`\n🎉 DEPLOYMENT READY!`);
      console.log(`Production URL: https://${statusRes.data.url}`);
      console.log(`Alias URL: https://${PROJECT_NAME}.vercel.app`);
      break;
    } else if (state === 'ERROR' || state === 'CANCELED') {
      console.error('❌ Build failed on Vercel:', statusRes.data);
      break;
    }
  }
}

main().catch(console.error);
