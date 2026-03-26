# Metro Wholesale Chatbot

A production-ready chatbot widget for Metro Wholesale, powered by the [Kaily AI Chat SDK](https://www.kaily.ai/).

## Stack

- **React 19** + **Vite 8** — fast, modern frontend
- **Tailwind CSS 3** — utility-first styling
- **@kaily-ai/chat-sdk** — AI copilot messaging, thread management, and streaming

## Getting Started

```bash
npm install
npm run dev       # → http://localhost:5173
npm run build     # production bundle → dist/
```

## Project Structure

```
src/
├── App.jsx                 # Root widget layout, routing, state
├── main.jsx                # Entry point
├── index.css               # Global styles + animations
├── assets/
│   └── logo.png            # Metro Wholesale brand icon
├── components/
│   ├── CategoryDrawer.jsx  # Slide-up query topic navigator
│   ├── ChatInput.jsx       # Message input with streaming controls
│   ├── ChatWindow.jsx      # Message list + category bar
│   ├── MessageBubble.jsx   # Individual message rendering + question parsing
│   ├── TopicHistory.jsx    # Conversation history drawer
│   ├── UIKit.jsx           # Shared UI primitives (avatar, wave bars, typing dots)
│   └── WelcomeScreen.jsx   # Initial greeting + popular questions
└── hooks/
    └── useBot.js           # Kaily SDK integration (init, messaging, threads)
```
