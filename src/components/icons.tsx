
import React from 'react';

export const UploadIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-3-3m0 0l3-3m-3 3h12" />
  </svg>
);

export const SendIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
);

export const BotIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zm0 15c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4zm-4-1h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" />
    </svg>
);

export const DocumentIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export const LogoIcon: React.FC = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#grad1)"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" fill="url(#grad2)"/>
        <path d="M2 7L12 12L22 7L12 2L2 7Z" stroke="url(#grad3)" strokeWidth="0.5"/>
        <path d="M2 17L12 22L22 17L12 12L2 17Z" stroke="url(#grad4)" strokeWidth="0.5"/>
        <defs>
            <linearGradient id="grad1" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34D399"/>
                <stop offset="1" stopColor="#2563EB"/>
            </linearGradient>
            <linearGradient id="grad2" x1="12" y1="12" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3B82F6"/>
                <stop offset="1" stopColor="#60A5FA"/>
            </linearGradient>
            <linearGradient id="grad3" x1="12" y1="2" x2="12" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6EE7B7"/>
                <stop offset="1" stopColor="#60A5FA"/>
            </linearGradient>
             <linearGradient id="grad4" x1="12" y1="12" x2="12" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA"/>
                <stop offset="1" stopColor="#93C5FD"/>
            </linearGradient>
        </defs>
    </svg>
);
