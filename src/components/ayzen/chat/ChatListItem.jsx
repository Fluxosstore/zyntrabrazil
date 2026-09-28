import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MoreVertical, Pin, Check, MessageSquareText } from "lucide-react";
import ChatItemMenu from "./ChatItemMenu";

export default function ChatListItem({ conv, active, onSelect, onPin, onRenameCommit, onSelectToggle, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conv.title);
  const itemRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (itemRef.current && !itemRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const commitEdit = () => {
    if (editTitle.trim() && editTitle.trim() !== conv.title) {
      onRenameCommit?.(conv.id, editTitle.trim());
    }
    setEditing(false);
  };

  return (
    <div ref={itemRef} className="relative">
      <div
        onClick={() => !editing && onSelect?.(conv.id)}
        className={`flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer transition-colors group ${
          active ? "bg-gray-200/60 text-gray-900" : "text-gray-700 hover:bg-gray-200/60"
        }`}
      >
        {conv.selected && <Check className="w-3.5 h-3.5 text-[#7E57C2] shrink-0" />}
        {conv.pinned && !conv.selected && <Pin className="w-3 h-3 text-gray-500 shrink-0" />}
        {!conv.selected && !conv.pinned && <MessageSquareText className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
        {editing ? (
          <input
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") { setEditing(false); setEditTitle(conv.title); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-xs font-medium bg-white border border-gray-300 rounded px-1.5 py-0.5 outline-none focus:border-gray-400"
          />
        ) : (
          <span className="flex-1 text-xs font-medium truncate">{conv.title}</span>
        )}
        {!editing && (
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className={`w-5 h-5 flex items-center justify-center rounded shrink-0 transition-colors ${
              active ? "text-gray-600 opacity-100" : "text-gray-400 opacity-0 group-hover:opacity-100"
            } hover:bg-gray-300/50`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {menuOpen && (
          <ChatItemMenu
            onPin={() => onPin?.(conv.id)}
            onRename={() => { setEditTitle(conv.title); setEditing(true); }}
            onSelect={() => onSelectToggle?.(conv.id)}
            onDelete={() => onDelete?.(conv.id)}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}