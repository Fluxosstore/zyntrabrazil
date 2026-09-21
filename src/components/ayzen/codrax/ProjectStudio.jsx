import React, { useState, useEffect, useCallback } from "react";
import {
  Github,
  Loader2,
  FolderGit2,
  FileCode,
  Sparkles,
  Check,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { base44 } from "@/api/base44Client";

const GITHUB_CONNECTOR_ID = "6aafb964b05c265a56e30631";

export default function ProjectStudio() {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState([]);
  const [view, setView] = useState("home"); // home | create | browse | file
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [repoTree, setRepoTree] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  // Create state
  const [projectDesc, setProjectDesc] = useState("");
  const [projectType, setProjectType] = useState("web");
  const [generating, setGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createdRepo, setCreatedRepo] = useState(null);

  // Edit state
  const [editInstruction, setEditInstruction] = useState("");
  const [generatingEdit, setGeneratingEdit] = useState(false);
  const [editedContent, setEditedContent] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await base44.functions.invoke("codraxGitHub", { action: "listRepos" });
      setRepos(res.data?.repos || []);
      setConnected(true);
    } catch {
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const authed = await base44.auth.isAuthenticated();
      if (authed) await fetchData();
      else setLoading(false);
    })();
  }, [fetchData]);

  const handleConnect = async () => {
    try {
      const url = await base44.connectors.connectAppUser(GITHUB_CONNECTOR_ID);
      const popup = window.open(url, "_blank");
      const timer = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(timer);
          fetchData();
        }
      }, 500);
    } catch (e) {
      console.error("GitHub connect error:", e);
    }
  };

  const handleDisconnect = async () => {
    await base44.connectors.disconnectAppUser(GITHUB_CONNECTOR_ID);
    setConnected(false);
    setRepos([]);
    setView("home");
  };

  const handleGenerate = async () => {
    if (!projectDesc.trim()) return;
    setGenerating(true);
    setGeneratedProject(null);
    try {
      const res = await base44.functions.invoke("codraxGitHub", {
        action: "generateProject",
        description: projectDesc,
        projectType,
      });
      setGeneratedProject(res.data?.project);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateRepo = async () => {
    if (!generatedProject?.files?.length) return;
    setCreating(true);
    try {
      const res = await base44.functions.invoke("codraxGitHub", {
        action: "createProject",
        name: generatedProject.name,
        description: generatedProject.description,
        files: generatedProject.files,
        isPrivate: true,
      });
      setCreatedRepo(res.data);
      setView("home");
      setGeneratedProject(null);
      setProjectDesc("");
      fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const openRepo = async (repo) => {
    setSelectedRepo(repo);
    setView("browse");
    try {
      const res = await base44.functions.invoke("codraxGitHub", {
        action: "getRepoTree",
        repo: repo.name,
        branch: repo.defaultBranch,
      });
      setRepoTree(res.data?.tree || []);
    } catch (e) {
      console.error(e);
    }
  };

  const openFile = async (filePath) => {
    setSelectedFile(filePath);
    setView("file");
    setEditedContent(null);
    try {
      const res = await base44.functions.invoke("codraxGitHub", {
        action: "getFile",
        repo: selectedRepo.name,
        path: filePath,
        branch: selectedRepo.defaultBranch,
      });
      setFileContent(res.data?.content || "");
    } catch (e) {
      console.error(e);
    }
  };

  const handleGenerateEdit = async () => {
    if (!editInstruction.trim()) return;
    setGeneratingEdit(true);
    try {
      const res = await base44.functions.invoke("codraxGitHub", {
        action: "generateEdit",
        repo: selectedRepo.name,
        path: selectedFile,
        currentContent: fileContent,
        instruction: editInstruction,
        branch: selectedRepo.defaultBranch,
      });
      setEditedContent(res.data?.content);
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingEdit(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await base44.functions.invoke("codraxGitHub", {
        action: "editFile",
        repo: selectedRepo.name,
        path: selectedFile,
        content: editedContent,
        message: `Codrax: edit ${selectedFile}`,
        branch: selectedRepo.defaultBranch,
      });
      setFileContent(editedContent);
      setEditedContent(null);
      setEditInstruction("");
    } catch (e) {
      console.error(e);
    }
  };

  // ===== Not connected =====
  if (!connected && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-gray-900 flex items-center justify-center mb-5">
          <Github className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Conecte seu GitHub</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          O Codrax precisa de acesso ao seu GitHub para criar e editar seus projetos. Seus dados ficam seguros — você pode desconectar a qualquer momento.
        </p>
        <button
          onClick={handleConnect}
          className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Github className="w-4 h-4" />
          Conectar GitHub
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ===== Created repo success banner =====
  {createdRepo && (
    <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
      <Check className="w-4 h-4 shrink-0" />
      <span>Repositório criado com {createdRepo.fileCount} arquivos!</span>
      <a href={createdRepo.repoUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline">
        Ver no GitHub <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  )}

  // ===== Create project view =====
  if (view === "create") {
    return (
      <div className="max-w-2xl">
        <button onClick={() => { setView("home"); setGeneratedProject(null); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Criar novo projeto</h3>
        <p className="text-sm text-gray-500 mb-5">Descreva o que você quer e o Codrax gera o código completo no seu GitHub.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Tipo de projeto</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "web", label: "App Web" },
                { id: "api", label: "API" },
                { id: "bot", label: "Bot" },
                { id: "script", label: "Script" },
                { id: "landing", label: "Landing Page" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setProjectType(t.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    projectType === t.id ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1.5 block">Descrição do projeto</label>
            <textarea
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Ex: Uma API REST em Node.js com Express para gerenciar tarefas, com rotas CRUD, validação e SQLite..."
              rows={4}
              className="w-full rounded-xl bg-white border border-gray-200 p-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 transition-colors resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={!projectDesc.trim() || generating}
            className="w-full py-3 rounded-xl bg-violet-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-violet-700 disabled:opacity-50 transition-colors"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Gerando projeto...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Gerar projeto</>
            )}
          </button>
        </div>

        {/* Generated project preview */}
        {generatedProject && (
          <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900">{generatedProject.name}</p>
                <p className="text-xs text-gray-500">{generatedProject.description}</p>
              </div>
              <span className="text-xs text-gray-400">{generatedProject.files?.length} arquivos</span>
            </div>
            <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
              {generatedProject.files?.map((f, i) => (
                <div key={i} className="px-4 py-2.5 flex items-center gap-2 text-xs">
                  <FileCode className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="font-mono text-gray-700">{f.path}</span>
                  <span className="ml-auto text-gray-400">{f.content?.length} chars</span>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleCreateRepo}
                disabled={creating}
                className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {creating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Criando repositório...</>
                ) : (
                  <><Github className="w-4 h-4" /> Criar no GitHub</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ===== Browse repo view =====
  if (view === "browse" && selectedRepo) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => { setView("home"); setSelectedRepo(null); setRepoTree([]); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </button>
        <div className="flex items-center gap-2 mb-1">
          <FolderGit2 className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-bold text-gray-900">{selectedRepo.name}</h3>
        </div>
        {selectedRepo.description && <p className="text-sm text-gray-500 mb-4">{selectedRepo.description}</p>}

        <p className="text-xs font-semibold text-gray-400 mb-2">ARQUIVOS ({repoTree.length})</p>
        {repoTree.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">Carregando arquivos...</div>
        ) : (
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {repoTree.map((f) => (
              <button
                key={f.path}
                onClick={() => openFile(f.path)}
                className="w-full px-3.5 py-2.5 flex items-center gap-2 text-xs hover:bg-gray-50 transition-colors text-left"
              >
                <FileCode className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="font-mono text-gray-700 truncate">{f.path}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 ml-auto shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ===== File edit view =====
  if (view === "file" && selectedRepo && selectedFile) {
    return (
      <div className="max-w-3xl">
        <button onClick={() => { setView("browse"); setSelectedFile(null); setEditedContent(null); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar aos arquivos
        </button>
        <div className="flex items-center gap-2 mb-4">
          <FileCode className="w-4 h-4 text-gray-500" />
          <span className="font-mono text-sm text-gray-700">{selectedFile}</span>
        </div>

        {/* Edit instruction */}
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-700 mb-1.5 block">O que você quer alterar?</label>
          <div className="flex gap-2">
            <input
              value={editInstruction}
              onChange={(e) => setEditInstruction(e.target.value)}
              placeholder="Ex: Adicione validação de email no campo de input..."
              className="flex-1 h-10 rounded-xl bg-white border border-gray-200 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-violet-400 transition-colors"
            />
            <button
              onClick={handleGenerateEdit}
              disabled={!editInstruction.trim() || generatingEdit}
              className="px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold flex items-center gap-1.5 hover:bg-violet-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {generatingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {generatingEdit ? "Gerando..." : "Gerar edição"}
            </button>
          </div>
        </div>

        {/* File content / edited content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-gray-400 mb-1.5">ATUAL</p>
            <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
              {fileContent || "Carregando..."}
            </pre>
          </div>
          {editedContent !== null && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-violet-600">EDITADO</p>
                <button
                  onClick={handleSaveEdit}
                  className="text-xs font-semibold text-white bg-violet-600 px-3 py-1 rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Salvar no GitHub
                </button>
              </div>
              <pre className="bg-violet-950 text-violet-100 rounded-xl p-4 text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap border border-violet-700">
                {editedContent}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ===== Home view =====
  return (
    <div>
      {createdRepo && (
        <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
          <Check className="w-4 h-4 shrink-0" />
          <span>Repositório <strong>{createdRepo.repoName}</strong> criado com {createdRepo.fileCount} arquivos!</span>
          <a href={createdRepo.repoUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline">
            Ver <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => setView("create")}
          className="text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-violet-300 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-violet-600" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Criar novo projeto</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Descreva e o Codrax gera o código completo, cria o repo e faz o commit.</p>
        </button>
        <button
          onClick={handleDisconnect}
          className="text-left bg-white border border-gray-200 rounded-2xl p-5 hover:border-red-200 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
            <Github className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Desconectar GitHub</h3>
          <p className="text-xs text-gray-500 leading-relaxed">Revoga o acesso do Codrax ao seu GitHub.</p>
        </button>
      </div>

      {/* Repos list */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900">Seus repositórios</h3>
        <span className="text-xs text-gray-400">{repos.length} repos</span>
      </div>
      {repos.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400">
          Nenhum repositório ainda. Crie seu primeiro projeto com o Codrax.
        </div>
      ) : (
        <div className="space-y-2">
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => openRepo(repo)}
              className="w-full text-left bg-white border border-gray-200 rounded-xl p-3.5 hover:border-gray-300 transition-colors flex items-center gap-3"
            >
              <FolderGit2 className="w-5 h-5 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{repo.name}</p>
                {repo.description && <p className="text-xs text-gray-500 truncate">{repo.description}</p>}
              </div>
              <span className="text-xs text-gray-400 shrink-0">{repo.private ? "Privado" : "Público"}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}