'use client';

import { useRef, useState } from 'react';

export default function MasterclassCard({ course, bgClass }) {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div className="premium-glow-card p-10 md:p-12 rounded-[2.5rem] md:rounded-[3rem] group flex flex-col h-full w-full">
      {/* Included Free Ribbon */}
      {course.badge && (
        <div className="absolute top-8 right-8 bg-green-500/20 text-green-400 border border-green-500/30 font-bold px-4 py-1.5 rounded-full text-sm z-20 shadow-[0_0_15px_rgba(34,197,94,0.2)] backdrop-blur-md">
          {course.badge}
        </div>
      )}

      {/* Icon / Image Container */}
      <div className={`relative z-10 w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-10 text-neutral-900 dark:text-neutral-100 shadow-2xl ${bgClass} transform group-hover:scale-110 group-active:scale-110 group-hover:rotate-12 group-active:rotate-12 transition-all duration-500 ease-out overflow-hidden border border-white/10`}>
        {course.image ? (
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          "🎓"
        )}
      </div>
      
      <h3 className="relative z-10 text-3xl md:text-4xl font-black mb-5 text-neutral-900 dark:text-white dark:group-hover:text-white group-hover:text-primary transition-colors duration-300">
        {course.title}
      </h3>
      
      <p className="relative z-10 text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed transition-colors duration-300 flex-grow">
        {course.description}
      </p>
    </div>
  );
}
