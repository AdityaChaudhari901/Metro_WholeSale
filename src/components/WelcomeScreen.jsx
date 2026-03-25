import React from 'react';

const POPULAR_QUESTIONS = [
  'How do I become a Metro customer?',
  'How to place the order in Metro app?',
  'How can I check the status of my registration?',
  'How do I change my mobile number?',
  'How can I change the delivery address once order is confirmed?',
];

const CATEGORIES = [
  'General Queries',
  'Store & Support',
  'Product Offer & Price',
  'Exchange & Refunds',
  'Order & Delivery',
  'Registration'
];

export default function WelcomeScreen({ onQuestionClick, onCategoryClick }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto pb-4 scrollbar-hide">
      {/* Greeting section */}
      <div className="flex-1 flex flex-col justify-center px-5 pt-6 pb-3">
        <h1 className="text-[19px] font-bold text-gray-800 leading-snug mb-1.5">
          Hi, I am here to answer<br />your queries!
        </h1>
        <p className="text-[13px] text-gray-500 mb-5">
          Your one stop guide for anything related to Metro
        </p>

        {/* Popular questions */}
        <p className="text-[12px] text-gray-500 italic mb-3 font-medium">Popular Questions...</p>
        <div className="flex flex-col items-start gap-2.5">
          {POPULAR_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => onQuestionClick(q)}
              className="text-left text-[12.5px] text-gray-800 border border-[#A6C0E7] rounded-full px-4 py-1.5 hover:bg-[#F4F7FB] hover:border-[#86A8DC] transition-all duration-150 active:scale-[0.98]"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Category browse section */}
      <div className="px-5 pb-2">
        <p className="text-[11px] text-gray-400 italic mb-2 font-medium">
          Browse queries through tailor made categories ...
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className="flex-shrink-0 text-[12.5px] border border-gray-200 rounded-full px-3.5 py-1.5 hover:border-blue-300 hover:bg-blue-50/50 hover:text-[#004A99] transition-all duration-150 font-medium text-gray-700 active:scale-95"
            >
              {cat}
              {i === CATEGORIES.length - 1 && (
                <span className="ml-1 text-gray-400">›</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
