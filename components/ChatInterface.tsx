
import React, { useState, useRef, useEffect } from 'react';
import { QAPair } from '../types';
import { SendIcon, UserIcon, BotIcon, DocumentIcon } from './icons';

interface ChatInterfaceProps {
  qaHistory: QAPair[];
  onAskQuestion: (question: string) => void;
  isLoading: boolean;
  fileName: string;
}

const ChatBubble: React.FC<{ role: 'user' | 'bot'; text: string; isError?: boolean }> = ({ role, text, isError }) => {
    const isUser = role === 'user';
    const bubbleClass = isUser
      ? 'bg-blue-600 rounded-br-none self-end'
      : isError ? 'bg-red-900/50 border border-red-500/50 rounded-bl-none self-start' : 'bg-gray-700 rounded-bl-none self-start';
    const icon = isUser ? <UserIcon /> : <BotIcon />;
  
    return (
      <div className={`flex items-start gap-3 w-full max-w-2xl mx-auto ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">{icon}</div>
        <div className={`px-4 py-3 rounded-xl ${bubbleClass}`}>
            <pre className="whitespace-pre-wrap font-sans text-base">{text}</pre>
        </div>
      </div>
    );
};


export const ChatInterface: React.FC<ChatInterfaceProps> = ({ qaHistory, onAskQuestion, isLoading, fileName }) => {
  const [question, setQuestion] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [qaHistory, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onAskQuestion(question);
      setQuestion('');
    }
  };

  return (
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-120px)] bg-gray-800/50 rounded-xl overflow-hidden shadow-lg">
      <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
        <div className="p-4 mb-4 bg-gray-700/50 rounded-lg flex items-center gap-3 text-gray-300">
            <DocumentIcon />
            <span className="font-medium">Ready to answer questions about: <strong>{fileName}</strong></span>
        </div>
        {qaHistory.map((qa, index) => (
          <React.Fragment key={index}>
            <ChatBubble role="user" text={qa.question} />
            {qa.answer && <ChatBubble role="bot" text={qa.answer} isError={qa.isError} />}
          </React.Fragment>
        ))}
        {isLoading && qaHistory[qaHistory.length - 1]?.answer === '' && (
          <div className="flex items-start gap-3 w-full max-w-2xl mx-auto self-start">
             <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1"><BotIcon /></div>
             <div className="px-4 py-3 rounded-xl bg-gray-700 rounded-bl-none self-start flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2 delay-150"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
             </div>
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-900/80 border-t border-gray-700/50">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 max-w-3xl mx-auto">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about your document..."
            disabled={isLoading}
            className="w-full px-4 py-3 bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="p-3 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};
