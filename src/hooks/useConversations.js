import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";

const SYNC_EVENT = "zyntra-conversations-changed";

export function useConversations() {
  const { user } = useAuth();
  const storageKey = `zyntra_conversations_${user?.id || "guest"}`;

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const reload = useCallback(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setConversations(saved ? JSON.parse(saved) : []);
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    reload();
    const handler = () => reload();
    window.addEventListener(SYNC_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(SYNC_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [reload]);

  const persist = useCallback((next) => {
    setConversations(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
    window.dispatchEvent(new Event(SYNC_EVENT));
  }, [storageKey]);

  const deleteConversation = useCallback((convId) => {
    setConversations((prev) => {
      const next = prev.filter((c) => c.id !== convId);
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  const renameConversation = useCallback((convId, newTitle) => {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  const togglePin = useCallback((convId) => {
    setConversations((prev) => {
      const updated = prev.map((c) => (c.id === convId ? { ...c, pinned: !c.pinned } : c));
      const next = [...updated].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  const toggleSelect = useCallback((convId) => {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === convId ? { ...c, selected: !c.selected } : c));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  const moveToFolder = useCallback((convId, folderId) => {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === convId ? { ...c, folder_id: folderId } : c));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  const removeFromFolder = useCallback((convId) => {
    setConversations((prev) => {
      const next = prev.map((c) => (c.id === convId ? { ...c, folder_id: null } : c));
      try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch {}
      window.dispatchEvent(new Event(SYNC_EVENT));
      return next;
    });
  }, [storageKey]);

  return {
    conversations,
    setConversations: persist,
    deleteConversation,
    renameConversation,
    togglePin,
    toggleSelect,
    moveToFolder,
    removeFromFolder,
  };
}