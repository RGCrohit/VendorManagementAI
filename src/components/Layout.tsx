'use client';

import React, { ReactNode } from 'react';
import { AIAgent } from './AIAgent';

interface LayoutProps {
  children: ReactNode;
  showAI?: boolean;
}

export function AppLayout({ children, showAI = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-navy text-white">
      {children}
      {showAI && <AIAgent />}
    </div>
  );
}
