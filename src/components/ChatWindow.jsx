import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble.jsx';

// Format a date to "Today", "Yesterday", or locale date string
function formatDateLabel(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChatWindow({ messages, messagesLoading, isStreaming, streamingMsgId, onQuestionClick, onViewMore }) {
  const bottomRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Loading messages…</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Start a conversation</p>
      </div>
    );
  }

  // Group messages by date for date separators
  let lastDateLabel = '';

  const categories = [
    "General Queries",
    "Store & Support",
    "Product Offer & Price",
    "Exchange & Refunds",
    "Order & Delivery",
    "Registration"
  ];

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth scrollbar-hide">
        {messages.map((msg) => {
          const dateLabel = formatDateLabel(msg.timestamp);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;
          const streaming = isStreaming && msg.id === streamingMsgId;

          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider bg-gray-50 border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
                    {dateLabel}
                  </span>
                </div>
              )}
              <MessageBubble message={msg} isStreaming={streaming} onQuestionClick={onQuestionClick} onViewMore={onViewMore} />
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} className="h-2" />
      </div>

      {/* Persistent Bottom Category Bar (Above Input) */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 overflow-x-auto scrollbar-hide scroll-smooth pb-1 pt-2">
        <div className="flex items-center gap-2 px-4 min-w-max pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onQuestionClick(cat)}
              className="px-3.5 py-1.5 rounded-full border border-gray-200 text-[12.5px] font-medium text-gray-700 hover:border-blue-300 hover:text-[#004A99] hover:bg-blue-50/50 transition-all bg-white whitespace-nowrap shadow-sm active:scale-95"
            >
              {cat}
            </button>
          ))}
          <button
            onClick={onViewMore}
            className="flex-shrink-0 text-[12.5px] font-semibold underline underline-offset-4 text-[#004A99] hover:text-[#003566] px-2 ml-1"
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}
