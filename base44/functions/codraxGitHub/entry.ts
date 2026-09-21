import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const GITHUB_CONNECTOR_ID = "6aafb964b05c265a56e30631";
const GITHUB_API = "https://api.github.com";

function ghHeaders(token) {
  return {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    // Get the app user's GitHub token
    let token;
    try {
      const conn = await base44.asServiceRole.connectors.getCurrentAppUserConnection(GITHUB_CONNECTOR_ID);
      token = conn.accessToken;
    } catch {
      return Response.json({ error: 'GitHub não conectado', notConnected: true }, { status: 401 });
    }

    const headers = ghHeaders(token);

    // ---- List user repos ----
    if (action === 'listRepos') {
      const res = await fetch(`${GITHUB_API}/user/repos?sort=updated&per_page=50&type=owner`, { headers });
      const repos = await res.json();
      return Response.json({
        repos: repos.map(r => ({
          id: r.id,
          name: r.full_name,
          private: r.private,
          updated: r.updated_at,
          description: r.description,
          defaultBranch: r.default_branch,
          url: r.html_url,
          stars: r.stargazers_count,
        })),
      });
    }

    // ---- Get repo file tree ----
    if (action === 'getRepoTree') {
      const { repo, branch } = body;
      const branchName = branch || 'main';
      const res = await fetch(`${GITHUB_API}/repos/${repo}/git/trees/${branchName}?recursive=1`, { headers });
      if (!res.ok) {
        const err = await res.json();
        return Response.json({ error: err.message || 'Repo não encontrado' }, { status: 400 });
      }
      const data = await res.json();
      return Response.json({
        tree: (data.tree || [])
          .filter(t => t.type === 'blob')
          .map(t => ({ path: t.path, size: t.size })),
      });
    }

    // ---- Get file content ----
    if (action === 'getFile') {
      const { repo, path, branch } = body;
      const ref = branch ? `?ref=${branch}` : '';
      const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}${ref}`, { headers });
      if (!res.ok) {
        const err = await res.json();
        return Response.json({ error: err.message || 'Arquivo não encontrado' }, { status: 400 });
      }
      const data = await res.json();
      let content = '';
      if (data.content) {
        content = atob(data.content.replace(/\n/g, ''));
      }
      return Response.json({ content, path, sha: data.sha });
    }

    // ---- AI: Generate project files ----
    if (action === 'generateProject') {
      const { description, projectType } = body;
      const prompt = `Você é o Codrax, um gerador de projetos de código. Gere um projeto completo e funcional baseado na descrição do usuário.

Retorne APENAS um JSON válido com esta estrutura exata:
{
  "name": "nome-do-repo (kebab-case, sem espaços)",
  "description": "descrição curta do projeto",
  "files": [
    { "path": "caminho/do/arquivo.ext", "content": "conteúdo completo do arquivo" }
  ]
}

Gere arquivos reais e funcionais. Inclua:
- README.md com instruções de setup e uso
- Arquivos de configuração (package.json, tsconfig.json, etc. quando aplicável)
- Código-fonte principal completo e funcional
- Comentários explicativos no código

Descrição do usuário: "${description}"
Tipo de projeto: ${projectType || "aplicação web"}

Gere entre 5 e 15 arquivos. Cada arquivo deve ter conteúdo real, não placeholders.`;

      const llmRes = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            files: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  content: { type: "string" },
                },
              },
            },
          },
        },
      });

      return Response.json({ project: llmRes });
    }

    // ---- Create repo + commit all files (single commit via Git Data API) ----
    if (action === 'createProject') {
      const { name, description, files, isPrivate } = body;

      // 1. Create repo
      const repoRes = await fetch(`${GITHUB_API}/user/repos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name,
          description: description || 'Projeto criado pelo Codrax',
          private: isPrivate !== false,
          auto_init: false,
        }),
      });
      if (!repoRes.ok) {
        const err = await repoRes.json();
        return Response.json({ error: err.message || 'Erro ao criar repositório' }, { status: 400 });
      }
      const repo = await repoRes.json();
      const repoFullName = repo.full_name;

      // 2. Create blobs for each file
      const treeEntries = [];
      for (const file of files) {
        const blobRes = await fetch(`${GITHUB_API}/repos/${repoFullName}/git/blobs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ content: file.content, encoding: 'utf-8' }),
        });
        if (!blobRes.ok) {
          const err = await blobRes.json();
          return Response.json({ error: `Erro ao criar blob para ${file.path}: ${err.message}` }, { status: 400 });
        }
        const blob = await blobRes.json();
        treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
      }

      // 3. Create tree
      const treeRes = await fetch(`${GITHUB_API}/repos/${repoFullName}/git/trees`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tree: treeEntries }),
      });
      const tree = await treeRes.json();

      // 4. Create initial commit
      const commitRes = await fetch(`${GITHUB_API}/repos/${repoFullName}/git/commits`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: 'Initial commit by Codrax 🚀',
          tree: tree.sha,
          parents: [],
        }),
      });
      const commit = await commitRes.json();

      // 5. Create main branch ref
      const refRes = await fetch(`${GITHUB_API}/repos/${repoFullName}/git/refs`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ref: 'refs/heads/main', sha: commit.sha }),
      });
      if (!refRes.ok) {
        // Try master as fallback
        await fetch(`${GITHUB_API}/repos/${repoFullName}/git/refs`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ ref: 'refs/heads/master', sha: commit.sha }),
        });
      }

      return Response.json({
        ok: true,
        repoUrl: repo.html_url,
        repoName: repoFullName,
        fileCount: files.length,
      });
    }

    // ---- Edit existing file (create/update on a branch) ----
    if (action === 'editFile') {
      const { repo, path, content, message, branch } = body;
      // Get current file sha
      const ref = branch ? `?ref=${branch}` : '';
      const curRes = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}${ref}`, { headers });
      let sha;
      if (curRes.ok) {
        const cur = await curRes.json();
        sha = cur.sha;
      }

      const payload = {
        message: message || `Codrax: update ${path}`,
        content: btoa(unescape(encodeURIComponent(content))),
      };
      if (sha) payload.sha = sha;
      if (branch) payload.branch = branch;

      const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        return Response.json({ error: err.message || 'Erro ao editar arquivo' }, { status: 400 });
      }
      const data = await res.json();
      return Response.json({ ok: true, url: data.content?.html_url });
    }

    // ---- AI: Generate edit for existing file ----
    if (action === 'generateEdit') {
      const { repo, path, currentContent, instruction, branch } = body;
      const prompt = `Você é o Codrax. O usuário quer editar o arquivo "${path}" no repositório "${repo}".

Conteúdo atual do arquivo:
\`\`\`
${currentContent}
\`\`\`

Instrução do usuário: "${instruction}"

Retorne APENAS o conteúdo completo do arquivo editado, sem explicações, sem markdown, sem code blocks. Apenas o código final.`;

      const llmRes = await base44.integrations.Core.InvokeLLM({
        prompt,
      });

      return Response.json({ content: llmRes });
    }

    return Response.json({ error: 'Ação desconhecida: ' + action }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}