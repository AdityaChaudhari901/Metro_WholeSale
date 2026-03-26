import React, { useState, useEffect } from 'react';

const CATEGORIES = [
  'General Queries',
  'Store & Support',
  'Product Offer & Price',
  'Exchange & Refunds',
  'Order & Delivery',
  'Registration'
];

const CATEGORY_QUESTIONS = {
  'General Queries': [
    'Login Not working',
    'OTP not coming',
    'Unable to place order',
    'Unable to cancel order',
    'Unable to deliver order',
    'Unable to add to cart',
    'Unable to view products',
    'Unable to do product wishlist',
    'Unable to add Delivery Address',
    'Unable to update my Profile'
  ],
  'Store & Support': [
    'What is the status of my complaint?',
    'How can I supply products to the Metro store?',
    'How can I collect the belongings left at the store at the time of purchase?',
    'How to apply for a job at Metro store?',
    'What are the timings and contact details of Metro Stores?'
  ],
  'Product Offer & Price': [
    'How to check product price?',
    'What are the latest offers?',
    'Do you have bulk discounts?',
    'Price match policy?'
  ],
  'Exchange & Refunds': [
    'What is your refund policy?',
    'How do I exchange an item?',
    'Timeframe for returns?'
  ],
  'Order & Delivery': [
    'How to track my order?',
    'What are the delivery charges?',
    'Can I change delivery slot?',
    'Minimum order for free delivery?'
  ],
  'Registration': [
    'How do I become a Metro customer?',
    'Is it mandatory to register in Metro to shop in Metro stores?',
    'How to apply for Metro membership with my business details?',
    'How can I check the status of my registration?',
    'Will I get any membership card post enrolment?',
    'I want to change my billing address.',
    'How can I change my email address?',
    'I want to change the owner name of the business.',
    'My license has expired; how do I upload the renewed license?',
    'I want to add a secondary user (addon) to my business account.',
    'I want to update GST in my Metro business account.',
    'How do I change my mobile number?',
    'Can I use my membership at METRO centres in other countries?'
  ]
};

export default function CategoryDrawer({ isOpen, initialCategory, drawerQuestions, onClose, onSelect }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Set initial category if provided when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory || null);
    } else {
      setSelectedCategory(null);
    }
  }, [isOpen, initialCategory]);

  if (!isOpen) return null;

  // Prioritize live questions from the bot if we have them and we're in that category
  const isMatchingInitialCat = !initialCategory || selectedCategory === initialCategory;
  const currentQuestions = (isMatchingInitialCat && drawerQuestions && drawerQuestions.length > 0)
    ? drawerQuestions
    : (selectedCategory && CATEGORY_QUESTIONS[selectedCategory]) || [];

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/5 animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative bg-white w-full rounded-t-[24px] shadow-[0_-8px_30px_rgb(0,0,0,0.12)] border-t border-gray-100 flex flex-col animate-in slide-in-from-bottom-full duration-500 ease-out h-[85%] pb-4 overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full hover:bg-gray-100 transition-colors z-20"
          type="button"
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pt-14 px-7 pb-4">
          {!selectedCategory ? (
            /* View 1: Categories */
            <div className="flex flex-col gap-5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="text-left text-[17px] font-bold text-[#1A202C] hover:text-[#004A99] transition-all"
                  type="button"
                >
                  {cat}
                </button>
              ))}
              
              <button
                 onClick={() => {
                   onSelect("Others - Type in Query");
                   onClose();
                 }}
                 className="text-left mt-1"
                 type="button"
              >
                <span className="text-[17px] font-bold text-[#1A202C]">Others</span>
                <span className="text-[15px] text-gray-400 font-medium ml-2">- Type in Query</span>
              </button>

              <div className="mt-16">
                <p className="text-[14px] text-gray-400 italic font-medium leading-relaxed">
                  Select your Query topic to get it answered instantly...
                </p>
              </div>
            </div>
          ) : (
            /* View 2: Specific Questions */
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
               {currentQuestions.map((q, idx) => (
                 <button
                   key={idx}
                   onClick={() => {
                     onSelect(q);
                     onClose();
                   }}
                   className="text-left text-[15px] font-medium text-gray-700 hover:text-[#004A99] transition-all py-1"
                   type="button"
                 >
                   {q}
                 </button>
               ))}

               <button
                 onClick={() => {
                   onSelect("Others - Type in Query");
                   onClose();
                 }}
                 className="text-left mt-2 text-[15px] font-medium text-gray-700"
                 type="button"
               >
                 Others <span className="text-gray-400 ml-1">- Type in Query</span>
               </button>

               <div className="mt-12">
                <p className="text-[14px] text-gray-400 italic font-medium leading-relaxed">
                  Select your query to get it answered instantly...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Header/Footer Indicator (Context Toggle) */}
        <div 
          className="flex items-center gap-3 px-6 py-4 border-t border-gray-50 bg-gray-50/30 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={selectedCategory ? handleBack : undefined}
        >
           {selectedCategory ? (
             <>
               <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
               <span className="text-[16px] font-bold text-gray-800">{selectedCategory}</span>
             </>
           ) : (
             <>
               <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
               </svg>
               <span className="text-[16px] font-bold text-gray-800">Query Topics</span>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
