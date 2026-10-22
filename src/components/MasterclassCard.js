'use client';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imagekit';
import Link from 'next/link';

export default function MasterclassCard({ course }) {
  if (!course) return null;

  return (
    <div className="bg-white rounded-[2.5rem] border border-neutral-200/90 shadow-sm hover:shadow-2xl hover:border-neutral-300 transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* Edge-to-edge Image Container with Top Rounded Corners */}
        <div className="relative w-full h-56 sm:h-64 bg-neutral-100 overflow-hidden">
          <Image 
            src={getImageUrl(course.image)} 
            alt={course.title} 
            fill 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

          {/* Course Value Badge Pill on Top-Right Corner */}
          {course.badge && (
            <span className="absolute top-4 right-4 bg-[#900606] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg shadow-[#900606]/30 tracking-wide z-10 backdrop-blur-xs flex items-center gap-1">
              {course.badge}
            </span>
          )}
        </div>

        {/* Card Content with Clean Padding */}
        <div className="p-6 sm:p-8 pb-4">
          <h3 className="text-2xl font-bold text-[#111827] group-hover:text-[#900606] transition-colors mb-2.5 tracking-tight">
            {course.title}
          </h3>
          <p className="text-neutral-600 text-sm font-normal leading-relaxed mb-6">
            {course.description}
          </p>

          {/* Features Checklist */}
          {course.features && course.features.length > 0 && (
            <ul className="space-y-3 mb-6">
              {course.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-neutral-700">
                  <span className="w-4 h-4 rounded-full bg-[#900606]/10 text-[#900606] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Bottom Video Lessons Pill & Module Action Aligned with Clean Padding */}
      <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-4">
        <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#900606]/10 text-[#900606] text-xs font-bold">
            <span>▶</span>
            <span>{course.videoCount || '25+ Video Lessons'}</span>
          </div>
          <Link 
            href="/product" 
            className="text-xs font-bold text-neutral-600 group-hover:text-[#900606] transition-colors flex items-center gap-1"
          >
            <span>Explore Module</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}