import { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";

export function useFolders() {
  const [folders, setFolders] = useState([]);

  const loadFolders = useCallback(async () => {
    try {
      const recs = await base44.entities.Folder.list("-created_date", 100);
      setFolders(recs);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => { loadFolders(); }, [loadFolders]);

  return { folders, reloadFolders: loadFolders };
}