import React, { useState } from 'react';

// Metro Wholesale avatar icon
export function MetroAvatar({ size = 8 }) {
  const pixelSize = size * 4;
  
  return (
    <div
      className={`w-${size} h-${size} rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 overflow-hidden`}
      style={{ minWidth: pixelSize, maxWidth: pixelSize, minHeight: pixelSize, maxHeight: pixelSize }}
    >
      <img 
        src="/Metro.png" 
        alt="Metro" 
        className="w-full h-full object-contain rounded-md"
      />
    </div>
  );
}

// Wave bars icon (decorative / stop indicator)
export function WaveBars({ active = false }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full bg-blue-500 ${
            active ? 'wave-bar' : ''
          }`}
          style={{ height: active ? '12px' : `${6 + (i % 3) * 3}px`, opacity: active ? 1 : 0.5 }}
        />
      ))}
    </div>
  );
}

// Typing indicator dots
export function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="typing-dot w-2 h-2 rounded-full bg-blue-400"
        />
      ))}
    </div>
  );
}

// Thread context menu item
export function ThreadItem({ thread, isActive, onSelect, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const threadId = thread?.id ?? thread?.thread_id ?? '';
  const title = thread?.title ?? thread?.name ?? 'Untitled Chat';

  function handleRenameStart() {
    setNewTitle(title);
    setRenaming(true);
    setMenuOpen(false);
  }

  function handleRenameSubmit(e) {
    e.preventDefault();
    if (newTitle.trim()) onRename(threadId, newTitle.trim());
    setRenaming(false);
  }

  return (
    <div
      className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 ${
        isActive
          ? 'bg-blue-50 text-[#004A99] shadow-sm'
          : 'hover:bg-gray-100 text-gray-700'
      }`}
      onClick={() => !renaming && onSelect(threadId)}
    >
      <svg className="w-4 h-4 flex-shrink-0 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>

      {renaming ? (
        <form onSubmit={handleRenameSubmit} className="flex-1" onClick={(e) => e.stopPropagation()}>
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={() => setRenaming(false)}
            className="w-full text-sm bg-white border border-blue-300 rounded px-1 py-0.5 outline-none"
          />
        </form>
      ) : (
        <span className="flex-1 text-sm truncate">{title}</span>
      )}

      {!renaming && (
        <button
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-200 transition-opacity"
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      )}

      {menuOpen && (
        <div
          className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[130px]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            onClick={() => { handleRenameStart(); }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => { onDelete(threadId); setMenuOpen(false); }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
