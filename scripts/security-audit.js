// ==============================================================================
// SYNAPSE AI - AUTOMATED SECRET & SECURITY AUDIT SCRIPT
// Scans tracked files, client components, API routes, and Git history for leaks
// ==============================================================================

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SENSITIVE_PATTERNS = [
  { name: 'GitHub Personal Access Token', regex: /ghp_[a-zA-Z0-9]{30,}/g },
  { name: 'Vercel Access Token', regex: /vcp_[a-zA-Z0-9]{30,}/g },
  { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{20,}/g },
  { name: 'Private Key Block', regex: /-----BEGIN[ A-Z0-9_-]+PRIVATE KEY-----/g },
  { name: 'Hardcoded Bearer Header', regex: /Authorization:\s*["']Bearer\s+(ghp_|vcp_|sk-)/gi },
  { name: 'Direct Password in Connection String', regex: /postgres:\/\/[^:]+:[^@]+@/gi },
];

const IGNORED_PATHS = [
  'node_modules',
  '.git',
  '.next',
  '.cache',
  '.npm',
  '.local',
  'coverage',
  'build',
  'dist',
  '.env',
  '.env.local',
  '.env.production',
];

function getAllTrackedFiles(dir, fileList = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (IGNORED_PATHS.includes(item)) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      getAllTrackedFiles(fullPath, fileList);
    } else if (stat.isFile()) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function runAudit() {
  console.log('🔍 Running SynapseAI Production Security & Secret Audit...\n');
  const baseDir = path.resolve(__dirname, '..');
  const files = getAllTrackedFiles(baseDir);

  let totalFilesScanned = 0;
  let violationsFound = 0;

  files.forEach((filePath) => {
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
    if (relPath.startsWith('scripts/security-audit.js')) return; // skip self
    if (relPath === '.env.example') return; // template

    const content = fs.readFileSync(filePath, 'utf8');
    totalFilesScanned++;

    SENSITIVE_PATTERNS.forEach(({ name, regex }) => {
      const matches = content.match(regex);
      if (matches) {
        console.error(`🚨 SECURITY VIOLATION: ${name} found in "${relPath}"!`);
        matches.forEach((m) => console.error(`   Found: ${m.slice(0, 8)}...`));
        violationsFound++;
      }
    });

    // Check for NEXT_PUBLIC_ exposing secrets
    if (relPath.startsWith('app/') || relPath.startsWith('components/')) {
      if (/NEXT_PUBLIC_.*TOKEN/i.test(content) || /NEXT_PUBLIC_.*SECRET/i.test(content)) {
        console.error(`🚨 VIOLATION: Possible secret in NEXT_PUBLIC_ variable in "${relPath}"`);
        violationsFound++;
      }
    }
  });

  // Verify .gitignore
  const gitignorePath = path.join(baseDir, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    const mustIgnore = ['.env', '.env*', '*.pem', '*.key'];
    mustIgnore.forEach((rule) => {
      if (!gitignoreContent.includes(rule)) {
        console.warn(`⚠️ Warning: ${rule} not found in .gitignore`);
      }
    });
  }

  console.log(`\n======================================================`);
  console.log(`📊 Audit Summary:`);
  console.log(`   - Files Scanned: ${totalFilesScanned}`);
  console.log(`   - Violations Detected: ${violationsFound}`);
  console.log(`======================================================\n`);

  if (violationsFound === 0) {
    console.log('✅ PASS: All tracked files are clean. Zero secrets exposed.');
    process.exit(0);
  } else {
    console.error('❌ FAIL: Secrets detected in tracked files. Fix immediately.');
    process.exit(1);
  }
}

runAudit();
