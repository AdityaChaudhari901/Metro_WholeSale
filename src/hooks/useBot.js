import { useState, useEffect, useCallback, useRef } from 'react';
import { CopilotPlatform } from '@kaily-ai/chat-sdk';

const APP_TOKEN = 'cat-igygvd1q';

// Global counter to ensure uniqueness across any re-renders
let turnCounter = 0;

function extractArray(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  let foundArray = null;
  function deepFind(obj) {
    if (foundArray && foundArray.length > 0) return;
    if (Array.isArray(obj)) { foundArray = obj; return; }
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) { deepFind(obj[key]); }
      }
    }
  }
  deepFind(res);
  return foundArray || [];
}

export function useBot() {
  const botRef = useRef(null);
  const [botReady, setBotReady] = useState(false);
  const [initError, setInitError] = useState(null);

  const [threads, setThreads] = useState([]);
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMsgId, setStreamingMsgId] = useState(null);

  // Keep a ref of messages for late listeners
  const messagesRef = useRef([]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const activeThreadIdRef = useRef(null);
  useEffect(() => { activeThreadIdRef.current = activeThreadId; }, [activeThreadId]);

  const streamingMsgIdRef = useRef(null);
  useEffect(() => { streamingMsgIdRef.current = streamingMsgId; }, [streamingMsgId]);

  // ─── Init ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const copilot = CopilotPlatform.getInstance({
          serviceBaseUrl: 'https://public.copilot.live',
          surfaceClient: 'web',
        });
        const bot = await copilot.createBotInstance(APP_TOKEN);
        if (cancelled) return;
        botRef.current = bot;
        await bot.setContext({ currentPage: window.location.pathname });
        setBotReady(true);
        // Load initial threads
        try {
          setThreadsLoading(true);
          const res = await bot.getThreads({ page: 1, limit: 20 });
          setThreads(extractArray(res));
        } catch (e) { console.error('Error fetching threads:', e); } finally {
          setThreadsLoading(false);
        }
      } catch (err) {
        console.error('[Kaily] Init error:', err);
        setInitError(err?.message || 'Failed to initialize Copilot SDK');
      }
    }
    init();
    return () => {
      cancelled = true;
      botRef.current?.destroy?.();
    };
  }, []);

  const fetchThreads = useCallback(async () => {
    if (!botRef.current) return;
    try {
      setThreadsLoading(true);
      const res = await botRef.current.getThreads({ page: 1, limit: 20 });
      setThreads(extractArray(res));
    } catch (err) {
      console.error(err);
    } finally {
      setThreadsLoading(false);
    }
  }, []);

  const selectThread = useCallback(async (threadId) => {
    if (!botRef.current) return;
    setActiveThreadId(threadId);
    setMessages([]);
    setMessagesLoading(true);
    try {
      const res = await botRef.current.getMessages({ threadId });
      // The API returns messages newest-first. Reverse to get chronological order.
      const rawList = extractArray(res);
      const list = [...rawList].reverse();
      
      const unifiedMessages = list.map((m, i) => ({
         id: m.id || m.message_id || m._id || `historical-${i}`,
         role: m.role || (m.is_bot ? 'assistant' : 'user'),
         content: m.content || m.text || m.message || '',
         timestamp: m.timestamp || m.created_at || m.time || new Date().toISOString(),
      }));

      // Secondary sort by timestamp in case some messages have different timestamps
      unifiedMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(unifiedMessages);
    } catch (err) {
      console.error('getMessages Error:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  // ─── Messaging ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!botRef.current || !text.trim() || isStreaming) return;

    // Normalize text for robust DB matching (remove extra spaces, standardize quotes)
    const cleanText = text.trim()
      .replace(/\s+/g, ' ')
      .replace(/[\u201C\u201D]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");

    // 1. Force Stop any previous danglers
    if (activeThreadIdRef.current) {
        try { botRef.current.stopMessage({ thread_id: activeThreadIdRef.current }); } catch (e) {}
    }

    // 2. Increment TURN
    turnCounter++;
    const currentTurn = turnCounter;
    const nowStamp = new Date().toISOString();
    
    // IDs must be absolutely unique for this session instance
    const userMsgId = `user-${currentTurn}-${Date.now()}`;
    const botMsgId = `bot-${currentTurn}-${Date.now()}`;
    
    const userMsg = {
      id: userMsgId,
      role: 'user',
      content: cleanText,
      timestamp: nowStamp,
    };
    
    const botPlaceholder = { 
      id: botMsgId, 
      role: 'assistant', 
      content: '', 
      timestamp: new Date(new Date(nowStamp).getTime() + 100).toISOString()
    };

    // 3. Atomically Update State
    setMessages((prev) => [...prev, userMsg, botPlaceholder]);
    setIsStreaming(true);
    setStreamingMsgId(botMsgId);

    const payload = {
      text: cleanText,
      path: window.location.pathname,
      ...(activeThreadIdRef.current ? { thread_id: activeThreadIdRef.current } : {}),
    };

    try {
      const handleNewThread = (res) => {
        const newThreadId = res?.data?.thread_id ?? res?.thread_id;
        if (newThreadId && !activeThreadIdRef.current) {
          activeThreadIdRef.current = newThreadId;
          setActiveThreadId(newThreadId);
          // Use the FIRST user message as the thread title
          setThreads(prev => {
            if (prev.find(t => t.id === newThreadId || t.thread_id === newThreadId)) return prev;
            const firstUserMsg = messagesRef.current.find(m => m.role === 'user');
            const title = firstUserMsg?.content || cleanText;
            return [{ id: newThreadId, thread_id: newThreadId, title }, ...prev];
          });
          // Background sync after DB consistency lag
          setTimeout(fetchThreads, 2000);
        }
      };

      await botRef.current.message(payload, {
        deltaListener: (res) => {
          handleNewThread(res);
          const chunk = res?.data?.content ?? '';
          if (!chunk) return;
          setMessages((prev) => 
            prev.map(m => m.id === botMsgId ? { ...m, content: m.content + chunk } : m)
          );
        },
        replyListener: (res) => {
          handleNewThread(res);
          const replyContent = res?.data?.content ?? (typeof res?.data === 'string' ? res.data : '');
          setMessages((prev) => 
            prev.map(m => m.id === botMsgId ? { ...m, content: replyContent || m.content } : m)
          );

          if (streamingMsgIdRef.current === botMsgId) {
            setIsStreaming(false);
            setStreamingMsgId(null);
          }
        },
        progressListener: (res) => {
          const progressText = res?.data?.progress ?? res?.data?.content ?? '';
          if (progressText) {
            setMessages((prev) => 
              prev.map(m => m.id === botMsgId ? { ...m, progress: progressText } : m)
            );
          }
        },
        toolMessageListener: (res) => {
          const toolContent = res?.data?.content ?? '';
          if (toolContent) {
            setMessages((prev) => 
              prev.map(m => m.id === botMsgId ? { ...m, toolOutput: toolContent } : m)
            );
          }
        },
      });
    } catch (err) {
      console.error('[Kaily] Message Error:', err);
      setMessages((prev) => 
        prev.map(m => m.id === botMsgId ? { ...m, content: 'Sorry, I encountered an error.', isError: true } : m)
      );
      if (streamingMsgIdRef.current === botMsgId) {
        setIsStreaming(false);
        setStreamingMsgId(null);
      }
    }
  }, [isStreaming]);

  const startNewChat = useCallback(() => {
    setActiveThreadId(null);
    setMessages([]);
  }, []);

  const deleteThread = useCallback(async (threadId) => {
    if (!botRef.current) return;
    try {
      await botRef.current.deleteThread(threadId);
      setThreads((prev) => prev.filter(t => t.id !== threadId));
      if (activeThreadId === threadId) {
        startNewChat();
      }
    } catch (err) { console.error(err); }
  }, [activeThreadId, startNewChat]);

  const deleteAllThreads = useCallback(async () => {
    if (!botRef.current) return;
    try {
      await botRef.current.deleteAllThreads({});
      setThreads([]);
      startNewChat();
    } catch (err) { console.error(err); }
  }, [startNewChat]);

  const renameThread = useCallback(async (threadId, title) => {
    if (!botRef.current) return;
    try {
      await botRef.current.updateThread({ threadId, title });
      fetchThreads();
    } catch (err) { console.error(err); }
  }, [fetchThreads]);

  const stopMessage = useCallback(async () => {
    if (!botRef.current || !activeThreadIdRef.current) return;
    try {
      await botRef.current.stopMessage({ thread_id: activeThreadIdRef.current });
      setIsStreaming(false);
      setStreamingMsgId(null);
    } catch (err) { console.error(err); }
  }, []);

  return {
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
    deleteThread,
    deleteAllThreads,
    renameThread,
  };
}
