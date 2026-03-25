import React from 'react';

export default function TopicHistory({ threads, onSelectThread, onDeleteThread, onNewTopic, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 max-w-lg mx-auto">
        <div className="bg-white rounded-t-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-xl font-bold text-gray-900">Topic History</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Thread list */}
          <div className="max-h-72 overflow-y-auto scrollbar-hide px-4">
            {(!threads || !Array.isArray(threads) || threads.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-8">No conversations yet</p>
            ) : (
              threads.map((thread, i) => {
                const tId = thread?.id || thread?.thread_id || `thread-${i}`;
                const tTitle = thread?.title || `Conversation ${i + 1}`;
                return (
                <div key={tId}>
                  <div className="flex items-center gap-3 py-3">
                    {/* Chat icon */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
                      </svg>
                    </div>

                    {/* Thread title */}
                    <button
                      className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-[#004A99] transition-colors truncate"
                      onClick={() => { onSelectThread(tId); onClose(); }}
                    >
                      {tTitle}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => onDeleteThread(tId)}
                      className="flex-shrink-0 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>
                  {i < threads.length - 1 && <div className="h-px bg-gray-100" />}
                </div>
              )})
            )}
          </div>

          {/* New Topic button */}
          <div className="p-4 pt-3">
            <button
              onClick={() => { onNewTopic(); onClose(); }}
              className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 hover:bg-blue-100 active:bg-blue-200 text-[#004A99] font-medium py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-[#004A99]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
                </svg>
              </div>
              New Topic
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
