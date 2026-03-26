import React, { useState, useRef } from 'react';
import { WaveBars } from './UIKit.jsx';

export default function ChatInput({ onSend, onStop, isStreaming, disabled }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  function handleSend() {
    if (!text.trim() || isStreaming || disabled) return;
    onSend(text.trim());
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function handleKeyDown(e) {
    // Enter sends, Shift+Enter adds newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput(e) {
    setText(e.target.value);
    // Auto-grow textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  }

  return (
    <div className="px-4 pb-3 pt-2">
      <div className="flex items-end gap-2 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2 shadow-sm">
        {/* + button */}


        {/* Text area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your question …"
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 resize-none outline-none py-1.5 leading-snug max-h-[120px]"
        />



        {/* Wave / Stop button */}
        {isStreaming ? (
          <button
            onClick={onStop}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-colors mb-0.5"
            title="Stop generation"
          >
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 hover:bg-blue-200 transition-colors disabled:opacity-40 mb-0.5"
            title="Send"
          >
            <WaveBars active={false} />
          </button>
        )}
      </div>

      {/* Powered by Kaily */}
      <div className="flex items-center justify-center gap-1 mt-2">
        <span className="text-[10px] text-gray-400">🔥 Powered by Kaily</span>
      </div>
    </div>
  );
}
