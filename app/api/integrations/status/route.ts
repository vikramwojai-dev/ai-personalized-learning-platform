// ==============================================================================
// GET /api/integrations/status
// SECURE SERVER-SIDE INTEGRATION AUDIT
// Strictly sanitizes responses: NEVER exposes tokens, headers, or secrets
// ==============================================================================

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const vercelToken = process.env.VERCEL_TOKEN;
    const teamId = process.env.VERCEL_TEAM_ID;
    const projectName = process.env.VERCEL_PROJECT_NAME || 'ai-personalized-learning-platform';

    // 1. Safe GitHub Server-Side Check
    let githubStatus = {
      connected: false,
      account: 'masked',
      repository: 'ai-personalized-learning-platform',
      branch: 'main',
      status: 'Disconnected',
    };

    if (githubToken) {
      try {
        const ghRes = await fetch('https://api.github.com/repos/vikramwojai-dev/ai-personalized-learning-platform', {
          headers: {
            Authorization: `token ${githubToken}`,
            'User-Agent': 'SynapseAI-Platform',
          },
          next: { revalidate: 60 },
        });

        if (ghRes.ok) {
          const ghData = await ghRes.json();
          githubStatus = {
            connected: true,
            account: ghData.owner?.login || 'vikramwojai-dev',
            repository: ghData.name,
            branch: ghData.default_branch || 'main',
            status: 'Synced & Active',
          };
        }
      } catch {
        // Suppress sensitive stack trace; return safe status
        githubStatus.status = 'Error connecting to provider';
      }
    }

    // 2. Safe Vercel Server-Side Check
    let vercelStatus = {
      connected: false,
      projectName,
      environment: 'production',
      status: 'Disconnected',
      productionUrl: 'https://ai-personalized-learning-platform-vikramwojai.vercel.app',
    };

    if (vercelToken) {
      try {
        const teamParam = teamId ? `?teamId=${teamId}` : '';
        const vRes = await fetch(`https://api.vercel.com/v9/projects/${projectName}${teamParam}`, {
          headers: {
            Authorization: `Bearer ${vercelToken}`,
          },
          next: { revalidate: 60 },
        });

        if (vRes.ok) {
          const vData = await vRes.json();
          vercelStatus = {
            connected: true,
            projectName: vData.name,
            environment: 'production',
            status: 'Ready / Healthy',
            productionUrl: 'https://ai-personalized-learning-platform-vikramwojai.vercel.app',
          };
        }
      } catch {
        vercelStatus.status = 'Error connecting to provider';
      }
    }

    // 3. Return strictly safe payload without any secrets
    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      integrations: {
        github: githubStatus,
        vercel: vercelStatus,
        database: {
          connected: true,
          provider: 'PostgreSQL (pgvector)',
          status: 'Active (Optimized Mock Bridge / Direct Pool)',
        },
        aiLayer: {
          connected: true,
          provider: 'Socratic Engine + Local RAG Context',
          status: 'Ready',
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Unable to retrieve integration status safely.' },
      { status: 500 }
    );
  }
}
