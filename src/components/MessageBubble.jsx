import React from 'react';
import { TypingDots, MetroAvatar } from './UIKit.jsx';

function formatTime(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function MessageBubble({ message, isStreaming, onQuestionClick, onViewMore }) {
  const isUser = message.role === 'user';
  const isEmpty = !message.content && isStreaming;
  const hasVisibleProgress = message.progress && isStreaming;

  function parseContent(content) {
    if (!content) return { introText: '', questions: [], detectedCategory: null };
    if (isUser) return { introText: content, questions: [], detectedCategory: null };

    const lines = content.split('\n');
    const introLines = [];
    const questionList = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const match = trimmed.match(/^\d+\.\s*(.*)$/);
      if (match) {
        questionList.push(match[1].trim());
      } else {
        introLines.push(trimmed);
      }
    });

    // Improved category detection based on keywords
    const categoryMap = [
      { name: 'General Queries', keywords: ['general queries', 'popular questions', 'general', 'query'] },
      { name: 'Store & Support', keywords: ['store support', 'store & support', 'supply products', 'belongings', 'complaint', 'job at metro', 'metro stores'] },
      { name: 'Product Offer & Price', keywords: ['product offer', 'price', 'discounts', 'offers'] },
      { name: 'Exchange & Refunds', keywords: ['exchange', 'refunds', 'return'] },
      { name: 'Order & Delivery', keywords: ['order', 'delivery', 'track'] },
      { name: 'Registration', keywords: ['registration', 'become a customer', 'documents', 'business'] }
    ];
    
    const introText = introLines.join(' ');
    let detectedCategory = null;
    const lowerIntro = introText.toLowerCase();

    for (const item of categoryMap) {
      if (item.keywords.some(kw => lowerIntro.includes(kw))) {
        detectedCategory = item.name;
        break;
      }
    }

    return { introText, questions: questionList, detectedCategory };
  }

  const { introText, questions, detectedCategory } = parseContent(message.content);
  const isDisabled = isStreaming;

  // Hide SDK-generated stop confirmation messages
  if (!isUser && message.content && (
    message.content.toLowerCase().includes('stopped the query') ||
    message.content.toLowerCase().includes('you have stopped')
  )) return null;

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse mb-5' : 'flex-row mb-5 animate-in fade-in slide-in-from-bottom-2 duration-500'}`}>
      {!isUser && (
        <div className="mt-0.5 shrink-0">
          <div className="transform hover:scale-105 transition-transform"><MetroAvatar size={8} /></div>
        </div>
      )}
      {isUser && (
        <div className="mt-0.5 shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shadow-sm border border-slate-200">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      )}

      <div className={`flex flex-col gap-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {isUser && (
          <span className="text-[7.5px] text-gray-400 mr-2 font-medium bg-gray-50/50 px-1 py-0.5 rounded-full border border-gray-100 mb-0.5">{formatTime(message.timestamp)}</span>
        )}

        <div
          className={`px-4 py-3 text-[13.5px] leading-snug relative shadow-sm border transition-all ${
            isUser
              ? 'bg-white text-gray-800 border-gray-100 rounded-[14px] rounded-tr-none'
              : 'bg-[#ECF2FF] text-[#111111] border-[#D0E0FF] rounded-[14px] rounded-tl-none'
          }`}
        >
          {isEmpty ? (
            <div className="py-1 px-1.5"><TypingDots /></div>
          ) : (
            <div className={message.isError ? 'text-red-500 font-medium' : ''}>
              {hasVisibleProgress && (
                <p className="text-[8px] text-blue-500 mb-1 leading-none italic opacity-70">{message.progress}</p>
              )}
              {introText}
              {isStreaming && !isUser && (
                <span className="inline-block w-0.5 h-3 bg-blue-500 ml-1 animate-pulse align-middle" />
              )}
            </div>
          )}
        </div>

        {!isUser && questions.length > 0 && (
          <div className="w-full bg-white border border-gray-100 rounded-[16px] p-4 shadow-sm flex flex-col items-start gap-2.5 mt-1 animate-in fade-in zoom-in-95 duration-300">
            {questions.slice(0, 5).map((q, idx) => (
              <button
                key={idx}
                disabled={isDisabled}
                onClick={() => onQuestionClick(q)}
                className={`text-left text-[14px] font-medium transition-all ${
                   isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#004A99] hover:underline'
                }`}
              >
                {q}
              </button>
            ))}
            {(questions.length > 10 || (detectedCategory && detectedCategory !== 'General Queries')) && (
              <button
                disabled={isDisabled}
                onClick={() => onViewMore && onViewMore(detectedCategory, questions)}
                className={`text-left text-[13px] font-semibold underline underline-offset-4 mt-1 ${
                  isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-[#004A99] hover:text-[#003566]'
                }`}
              >
                View More
              </button>
            )}
          </div>
        )}

        {!isUser && (
          <span className="text-[7.5px] text-gray-400 ml-2 mt-0.5 font-medium bg-gray-50/50 px-1 py-0.5 rounded-full border border-gray-100">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
}

