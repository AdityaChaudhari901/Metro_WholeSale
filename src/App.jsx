import React, { useState } from 'react';
import { useBot } from './hooks/useBot.js';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import TopicHistory from './components/TopicHistory.jsx';
import CategoryDrawer from './components/CategoryDrawer.jsx';
import { MetroAvatar } from './components/UIKit.jsx';

export default function App() {
  const {
    botReady,
    initError,
    threads,
    threadsLoading,
    activeThreadId,
    messages,
    messagesLoading,
    isStreaming,
    streamingMsgId,
    sendMessage,
    stopMessage,
    selectThread,
    startNewChat,
    renameThread,
    deleteThread,
    deleteAllThreads,
  } = useBot();

  const [historyOpen, setHistoryOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const hasMessages = messages.length > 0;

  function handleQuickSend(text) {
    sendMessage(text);
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (initError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
            </svg>
          </div>
          <h2 className="font-semibold text-gray-800 mb-2">SDK Initialization Failed</h2>
          <p className="text-sm text-gray-500">{initError}</p>
        </div>
      </div>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!botReady) {
    return (
      <>
        {/* Widget Launcher (Loading) */}
        {!isWidgetOpen && (
          <button className="fixed bottom-6 right-6 w-14 h-14 bg-black rounded-2xl shadow-xl flex items-center justify-center transition-transform z-50">
             <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </button>
        )}
      </>
    );
  }

  // ── Main layout ────────────────────────────────────────────────────────────
  return (
    <>
      {/* Widget Launcher Button */}
      {!isWidgetOpen && (
        <div className="fixed bottom-[10px] right-[16px] z-50 flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="w-14 h-14 bg-[#004A99] rounded-xl shadow-2xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all overflow-hidden"
          >
            <span className="text-[#FFE000] font-black text-[15px] leading-none tracking-tighter" style={{ fontFamily: 'Arial, sans-serif' }}>METRO</span>
            <span className="text-white font-bold text-[7px] leading-tight tracking-wide" style={{ fontFamily: 'Arial, sans-serif' }}>Wholesale</span>
          </button>
        </div>
      )}

      {/* Main Chat Widget Panel */}
      <div 
        className={`fixed bottom-0 right-0 sm:bottom-[10px] sm:right-[16px] w-full h-full sm:w-[380px] sm:h-[700px] bg-white sm:rounded-[16px] shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right z-50 ${
          isWidgetOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
      >
        {/* Topic History drawer */}
        {historyOpen && (
          <TopicHistory
            threads={threads}
            onSelectThread={selectThread}
            onDeleteThread={deleteThread}
            onNewTopic={startNewChat}
            onClose={() => setHistoryOpen(false)}
          />
        )}

        {/* Header */}
        <header className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-white shadow-sm z-10">
          <div className="flex items-center gap-3">
              <MetroAvatar size={10} />
              <div>
                <h1 className="font-bold text-[#1A202C] text-[18px] leading-tight">Metro-Chatbot</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Vertical Three-dot menu → opens Topic History */}
              <button
                onClick={() => setHistoryOpen(true)}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#111] transition-colors"
                title="Topic History"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                </svg>
              </button>
              {/* Close Widget */}
              <button
                onClick={() => setIsWidgetOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#111] transition-colors"
                title="Close Chat"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Content area: welcome screen OR messages */}
          <div className="flex-1 overflow-hidden flex flex-col relative">
            {!hasMessages && !messagesLoading ? (
              <WelcomeScreen
                onQuestionClick={handleQuickSend}
                onCategoryClick={handleQuickSend}
              />
            ) : (
              <ChatWindow
                messages={messages}
                messagesLoading={messagesLoading}
                isStreaming={isStreaming}
                streamingMsgId={streamingMsgId}
                onQuestionClick={sendMessage}
                onViewMore={(cat) => setCategoryDrawerOpen(cat || true)}
              />
            )}

            {/* Category Drawer (inside relative area, sits above input) */}
            <CategoryDrawer
              isOpen={!!categoryDrawerOpen}
              initialCategory={typeof categoryDrawerOpen === 'string' ? categoryDrawerOpen : null}
              onClose={() => setCategoryDrawerOpen(false)}
              onSelect={sendMessage}
            />
          </div>

          {/* Input area */}
          <ChatInput
            onSend={sendMessage}
            onStop={stopMessage}
            isStreaming={isStreaming}
            disabled={!botReady}
          />
      </div>
    </>
  );
}
