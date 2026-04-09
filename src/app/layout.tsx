'use client';

import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'ProcurAI - Vendor & Project Management',
  description: 'AI-Powered Vendor & Project Management Platform',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-navy text-white">
        {children}
      </body>
    </html>
  );
}
