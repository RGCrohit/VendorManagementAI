'use client';

import { motion } from 'framer-motion';

interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  interactive?: boolean;
}

export function Card({ title, description, children, interactive = true }: CardProps) {
  const Component = interactive ? motion.div : 'div';
  const props = interactive ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: { scale: 1.02 },
    transition: { duration: 0.3 },
  } : {};

  return (
    <Component
      className="glass p-6 rounded-xl hover:glass-darker transition-all"
      {...props}
    >
      {title && (
        <h3 className="text-lg font-semibold mb-2 text-primary-blue">{title}</h3>
      )}
      {description && (
        <p className="text-sm text-gray-400 mb-4">{description}</p>
      )}
      {children}
    </Component>
  );
}
