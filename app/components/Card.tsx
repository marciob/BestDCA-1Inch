// app/components/Card.tsx
import React from "react";

type CardProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

export default function Card({ title, children, className }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-800 bg-[#0d1117] p-6 ${className}`}
    >
      <h2 className="mb-4 text-xl font-semibold text-white">{title}</h2>
      {children}
    </div>
  );
}
