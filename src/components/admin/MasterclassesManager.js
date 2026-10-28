'use client';

import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/imagekit';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function MasterclassesManager() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Header Controls matching Orders / Home pages
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Oct 1 – Oct 23, 2026');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Modal 1: Course Info (Add/Edit)
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [courseForm, setCourseForm] = useState({
    title: '',
    image: '',
    description: '',
    videoUrl: '',
    videoLink: '',
    active: true,
  });

  // Modal 2: Nested Curriculum Manager (Modules & Lessons)
  const [curriculumCourse, setCurriculumCourse] = useState(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);
  const [curriculumModules, setCurriculumModules] = useState([]);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Modal 3: Lesson Form (within Curriculum Manager)
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonTarget, setLessonTarget] = useState({ moduleIndex: 0, lessonIndex: null });
  const [lessonForm, setLessonForm] = useState({
    id: '',
    title: '',
    duration: '10:00',
    videoUrl: '',
    videoLink: '',
    subtitles: '',
    locked: false,
    completed: false,
    overview: '',
    keyTakeawaysText: '',
    resources: [],
  });

  // Resource adding state within Lesson Form
  const [newResource, setNewResource] = useState({
    title: '',
    fileSize: '1.2 MB',
    fileType: 'PDF Document',
    downloadUrl: '',
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: 'course', // 'course' | 'module' | 'lesson'
    id: null,
    moduleIndex: null,
    lessonIndex: null,
    title: '',
    message: '',
    isDeleting: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const broadcastSync = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('masterclasses-updated'));
      localStorage.setItem('creatorskit_masterclasses_updated', Date.now().toString());
      try {
        const bc = new BroadcastChannel('creatorskit_masterclasses_channel');
        bc.postMessage({ type: 'updated', timestamp: Date.now() });
        bc.close();
      } catch (e) {}
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/homepage-masterclasses?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) {
        setCourses(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    } finally {
      setLoading(false);
    }
  };

  // Open Course Add Modal
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      image: '',
      description: '',
      videoUrl: '',
      videoLink: '',
      active: true,
    });
    setIsCourseModalOpen(true);
  };

  // Open Course Edit Modal
  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    const existingVideoUrl =
      course.videoLink ||
      course.videoUrl ||
      course.modules?.[0]?.lessons?.[0]?.videoLink ||
      course.modules?.[0]?.lessons?.[0]?.videoUrl ||
      '';
    setCourseForm({
      title: course.title || '',
      image: course.image || '',
      description: course.description || '',
      videoUrl: existingVideoUrl,
      videoLink: existingVideoUrl,
      active: course.active !== false,
    });
    setIsCourseModalOpen(true);
  };

  // Save Course Details (Add / Edit)
  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      alert('Please enter a course title');
      return;
    }
    setIsSaving(true);

    try {
      const isEdit = !!editingCourse;
      const url = isEdit
        ? `/api/homepage-masterclasses/${editingCourse._id}`
        : '/api/homepage-masterclasses';
      const method = isEdit ? 'PUT' : 'POST';

      const linkToSave = (courseForm.videoLink || courseForm.videoUrl || '').trim();

      // Ensure modules and lessons exist so direct video playback works out-of-the-box
      let modules = isEdit ? (editingCourse.modules || []) : [];
      if (modules.length === 0) {
        modules = [
          {
            moduleTitle: 'Module 1: Complete Masterclass',
            lessons: [
              {
                id: 'lesson-1',
                title: courseForm.title.trim(),
                duration: 'Full Masterclass',
                videoUrl: linkToSave,
                videoLink: linkToSave,
                locked: false,
                completed: false,
              },
            ],
          },
        ];
      } else if (linkToSave) {
        if (modules[0]?.lessons?.[0]) {
          modules[0].lessons[0].videoUrl = linkToSave;
          modules[0].lessons[0].videoLink = linkToSave;
        }
      }

      const payload = {
        title: courseForm.title.trim(),
        image: courseForm.image.trim(),
        description: courseForm.description.trim(),
        videoUrl: linkToSave,
        videoLink: linkToSave,
        active: courseForm.active,
        order: isEdit ? (editingCourse.order || 1) : (courses.length + 1),
        badge: isEdit ? (editingCourse.badge || '100% Free') : '100% Free',
        duration: isEdit ? (editingCourse.duration || 'Full Masterclass') : 'Full Masterclass',
        progress: isEdit ? (editingCourse.progress || 0) : 0,
        modules,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCourseModalOpen(false);
        setEditingCourse(null);
        fetchCourses();
        broadcastSync();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to save course');
      }
    } catch (err) {
      console.error('Failed to save course', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Open Curriculum Manager Modal
  const handleOpenCurriculum = (course) => {
    setCurriculumCourse(course);
    const existingMods = course.modules && course.modules.length > 0 ? course.modules : [];
    setCurriculumModules(JSON.parse(JSON.stringify(existingMods)));
    setActiveModuleIndex(0);
    setIsCurriculumModalOpen(true);
  };

  // Save Curriculum (Modules & Lessons) to MongoDB
  const handleSaveCurriculum = async () => {
    if (!curriculumCourse) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/homepage-masterclasses/${curriculumCourse._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modules: curriculumModules,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        // Update local copy
        setCurriculumCourse(updated.data);
        setIsCurriculumModalOpen(false);
        fetchCourses();
        broadcastSync();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to sync curriculum with MongoDB');
      }
    } catch (err) {
      console.error('Failed to update curriculum', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Add a new Module
  const handleAddModule = () => {
    const nextNumber = curriculumModules.length + 1;
    const newMod = {
      moduleTitle: `Module ${nextNumber}: New Subject Module`,
      lessons: [],
    };
    const updated = [...curriculumModules, newMod];
    setCurriculumModules(updated);
    setActiveModuleIndex(updated.length - 1);
  };

  // Rename a Module
  const handleRenameModule = (index, newTitle) => {
    const updated = [...curriculumModules];
    updated[index].moduleTitle = newTitle;
    setCurriculumModules(updated);
  };

  // Request Delete Module
  const requestDeleteModule = (index, title) => {
    setDeleteModal({
      isOpen: true,
      type: 'module',
      moduleIndex: index,
      id: null,
      lessonIndex: null,
      title: 'Delete Module?',
      message: `Are you sure you want to delete "${title}" along with all of its lessons?`,
      isDeleting: false,
    });
  };

  // Open Lesson Add/Edit Modal
  const handleOpenLessonModal = (moduleIndex, lessonIndex = null) => {
    setLessonTarget({ moduleIndex, lessonIndex });
    const mod = curriculumModules[moduleIndex];
    if (lessonIndex !== null && mod?.lessons[lessonIndex]) {
      const l = mod.lessons[lessonIndex];
      const existingLessonLink = l.videoLink || l.videoUrl || '';
      setLessonForm({
        id: l.id || `lesson-${Date.now()}`,
        title: l.title || '',
        duration: l.duration || '10:00',
        videoUrl: existingLessonLink,
        videoLink: existingLessonLink,
        subtitles: l.subtitles || '',
        locked: l.locked || false,
        completed: l.completed || false,
        overview: l.overview || '',
        keyTakeawaysText: (l.keyTakeaways || []).join('\n'),
        resources: l.resources || [],
      });
    } else {
      setLessonForm({
        id: `lesson-${Date.now()}`,
        title: '',
        duration: '12:00',
        videoUrl: '',
        videoLink: '',
        subtitles: '',
        locked: false,
        completed: false,
        overview: '',
        keyTakeawaysText: '',
        resources: [],
      });
    }
    setNewResource({ title: '', fileSize: '1.2 MB', fileType: 'PDF Document', downloadUrl: '' });
    setIsLessonModalOpen(true);
  };

  // Save Lesson into curriculum state
  const handleSaveLesson = (e) => {
    e.preventDefault();
    const { moduleIndex, lessonIndex } = lessonTarget;
    const updatedModules = [...curriculumModules];
    const targetModule = updatedModules[moduleIndex];
    if (!targetModule) return;

    const takeawaysArray = lessonForm.keyTakeawaysText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const linkToSave = (lessonForm.videoLink || lessonForm.videoUrl || '').trim();

    const lessonData = {
      id: lessonForm.id || `lesson-${Date.now()}`,
      title: lessonForm.title,
      duration: lessonForm.duration || '10:00',
      videoUrl: linkToSave,
      videoLink: linkToSave,
      subtitles: lessonForm.subtitles || '',
      locked: !!lessonForm.locked,
      completed: !!lessonForm.completed,
      overview: lessonForm.overview || '',
      keyTakeaways: takeawaysArray,
      resources: lessonForm.resources || [],
    };

    if (lessonIndex !== null) {
      targetModule.lessons[lessonIndex] = lessonData;
    } else {
      targetModule.lessons.push(lessonData);
    }

    setCurriculumModules(updatedModules);
    setIsLessonModalOpen(false);
  };

  // Add Resource to current lesson
  const handleAddResourceToLesson = () => {
    if (!newResource.title) return;
    setLessonForm((prev) => ({
      ...prev,
      resources: [...prev.resources, { ...newResource }],
    }));
    setNewResource({ title: '', fileSize: '1.2 MB', fileType: 'PDF Document', downloadUrl: '' });
  };

  // Remove Resource from current lesson
  const handleRemoveResource = (rIdx) => {
    setLessonForm((prev) => ({
      ...prev,
      resources: prev.resources.filter((_, idx) => idx !== rIdx),
    }));
  };

  // Request Delete Lesson
  const requestDeleteLesson = (moduleIndex, lessonIndex, title) => {
    setDeleteModal({
      isOpen: true,
      type: 'lesson',
      moduleIndex,
      lessonIndex,
      id: null,
      title: 'Delete Lesson?',
      message: `Are you sure you want to delete lesson "${title}"?`,
      isDeleting: false,
    });
  };

  // Request Delete Course
  const requestDeleteCourse = (id, title) => {
    setDeleteModal({
      isOpen: true,
      type: 'course',
      id,
      moduleIndex: null,
      lessonIndex: null,
      title: 'Delete Masterclass Course?',
      message: `Are you sure you want to permanently delete "${title}"? This action cannot be undone.`,
      isDeleting: false,
    });
  };

  // Confirm Delete Action Dispatcher
  const handleConfirmDelete = async () => {
    const { type, id, moduleIndex, lessonIndex } = deleteModal;
    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      if (type === 'course' && id) {
        const res = await fetch(`/api/homepage-masterclasses/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCourses((prev) => prev.filter((c) => c._id !== id));
          setDeleteModal({ isOpen: false, type: 'course', id: null, moduleIndex: null, lessonIndex: null, title: '', message: '', isDeleting: false });
          broadcastSync();
        } else {
          setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
        }
      } else if (type === 'module') {
        const updated = curriculumModules.filter((_, idx) => idx !== moduleIndex);
        setCurriculumModules(updated);
        if (activeModuleIndex >= updated.length) {
          setActiveModuleIndex(Math.max(0, updated.length - 1));
        }
        setDeleteModal({ isOpen: false, type: 'course', id: null, moduleIndex: null, lessonIndex: null, title: '', message: '', isDeleting: false });
      } else if (type === 'lesson') {
        const updated = [...curriculumModules];
        if (updated[moduleIndex]) {
          updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, idx) => idx !== lessonIndex);
          setCurriculumModules(updated);
        }
        setDeleteModal({ isOpen: false, type: 'course', id: null, moduleIndex: null, lessonIndex: null, title: '', message: '', isDeleting: false });
      }
    } catch (err) {
      console.error('Delete error', err);
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  // Export report as CSV
  const handleExportReport = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Order,Course Title,Duration,Modules Count,Lessons Count,Badge,Status,Image URL\n';
    csvContent += courses
      .map((c) => {
        const mods = c.modules?.length || 0;
        const totalLessons = (c.modules || []).reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
        return `"${c.order || 0}","${(c.title || '').replace(/"/g, '""')}","${c.duration || ''}","${mods}","${totalLessons}","${(c.badge || '').replace(/"/g, '""')}","${c.active !== false ? 'Live' : 'Hidden'}","${c.image || ''}"`;
      })
      .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CreatorsKit_Courses_Report_${dateRange.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      c.badge?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-7 pb-8 text-[#111827]">
      {/* 1. TOP HEADER & ACTION CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#111827] tracking-tight leading-tight">
            Courses &amp; Masterclasses
          </h1>
          <p className="text-xs sm:text-[13px] text-neutral-500 font-normal mt-1">
            Manage your course catalog, curriculum modules, streaming videos, and student lesson resources.
          </p>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">
          {/* Active Courses Badge */}
          <div className="bg-white border border-neutral-200/90 text-neutral-700 text-xs font-semibold px-3.5 py-2.5 rounded-xl shadow-2xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{courses.length} Masterclasses</span>
          </div>

          {/* Date Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
              className="bg-white hover:bg-neutral-50 border border-neutral-200/90 text-neutral-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 shadow-2xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-neutral-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>{dateRange}</span>
            </button>

            {isDatePickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDatePickerOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                  <p className="px-3.5 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    Select Range
                  </p>
                  {['Oct 1 – Oct 23, 2026', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year to Date'].map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        setIsDatePickerOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 hover:bg-neutral-50 transition-colors font-medium cursor-pointer ${
                        dateRange === range ? 'text-[#DC2626] font-bold bg-red-50/50' : 'text-neutral-700'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Export Report Button */}
          <button
            type="button"
            onClick={handleExportReport}
            className="bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>Export report</span>
          </button>

          {/* Add Course Button */}
          <button
            type="button"
            onClick={handleOpenAddCourse}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xs hover:shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>+ Add Course</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CARD CONTAINER & TABLE */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-2xs space-y-6">
        {/* Full-width Search Bar */}
        <div className="w-full relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search masterclasses by title, description, or badge tag..."
            className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Masterclasses Table */}
        <div className="overflow-x-auto">
          {!loading && filteredCourses.length === 0 ? (
            <div className="py-14 text-center text-neutral-400">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400 text-xl font-bold">
                🎓
              </div>
              <p className="text-sm font-semibold text-neutral-700 mb-1">
                No courses found
              </p>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                {searchQuery
                  ? `No course matches your search query "${searchQuery}"`
                  : `No courses in database. Click "+ Add Course" above to create one.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs font-bold text-[#900606] hover:underline cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-100 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3 font-bold w-[6%]">ORDER</th>
                  <th className="py-3.5 px-3 font-bold w-[38%]">COURSE DETAILS</th>
                  <th className="py-3.5 px-3 font-bold w-[22%]">CURRICULUM MODULES</th>
                  <th className="py-3.5 px-3 font-bold w-[14%]">BADGE &amp; STATS</th>
                  <th className="py-3.5 px-3 font-bold w-[8%]">STATUS</th>
                  <th className="py-3.5 px-3 text-right font-bold w-[12%]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-700">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-4 px-3"><div className="w-8 h-4 bg-neutral-100 rounded"></div></td>
                    <td className="py-4 px-3"><div className="w-56 h-4 bg-neutral-100 rounded mb-1"></div><div className="w-36 h-3 bg-neutral-100 rounded"></div></td>
                    <td className="py-4 px-3"><div className="w-24 h-4 bg-neutral-100 rounded"></div></td>
                    <td className="py-4 px-3"><div className="w-16 h-4 bg-neutral-100 rounded"></div></td>
                    <td className="py-4 px-3"><div className="w-12 h-4 bg-neutral-100 rounded"></div></td>
                    <td className="py-4 px-3 text-right"><div className="w-24 h-7 bg-neutral-100 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                filteredCourses.map((c) => {
                  const modCount = c.modules?.length || 0;
                  const totalLessons = (c.modules || []).reduce(
                    (acc, m) => acc + (m.lessons?.length || 0),
                    0
                  );

                  return (
                    <tr key={c._id} className="hover:bg-neutral-50/70 transition-colors group">
                      <td className="py-4 px-3 align-middle font-bold text-neutral-900">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-extrabold border border-neutral-200/70">
                          {c.order || 0}
                        </span>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <div className="w-14 h-10 rounded-lg bg-neutral-100 border border-neutral-200/80 overflow-hidden flex-shrink-0 relative">
                              <img
                                src={getImageUrl(c.image)}
                                alt={c.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : null}
                          <div className="min-w-0">
                            <div className="font-bold text-neutral-900 text-sm group-hover:text-[#900606] transition-colors line-clamp-1">
                              {c.title}
                            </div>
                            <p className="text-[11px] text-neutral-500 font-normal line-clamp-1 mt-0.5 max-w-sm">
                              {c.description}
                            </p>
                            <div className="text-[10px] text-neutral-400 font-mono truncate mt-0.5">
                              Route: {c.ctaLink || '/account?tab=courses'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <button
                          type="button"
                          onClick={() => handleOpenCurriculum(c)}
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs group/btn"
                        >
                          <svg className="w-3.5 h-3.5 text-[#900606]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span>{modCount} Modules • {totalLessons} Lessons</span>
                          <span className="text-neutral-400 group-hover/btn:translate-x-0.5 transition-transform">→</span>
                        </button>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-50 text-[#900606] border border-red-100">
                            {c.badge || '100% Free'}
                          </span>
                          <div className="text-[11px] text-neutral-500 font-semibold flex items-center gap-1.5">
                            <span>⏱ {c.duration || '2h 15m'}</span>
                            <span>•</span>
                            <span>{c.progress || 0}% progress</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3 align-middle">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                            c.active !== false
                              ? 'bg-[#EAFBF3] text-[#129A64] border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                          }`}
                        >
                          {c.active !== false ? 'Live' : 'Hidden'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenCurriculum(c)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Manage Curriculum"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" strokeWidth={2} />
                            </svg>
                            <span>Curriculum</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditCourse(c)}
                            className="p-1.5 text-neutral-400 hover:text-[#900606] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Course Details"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => requestDeleteCourse(c._id, c.title)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Course"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          )}
        </div>
      </div>



      {/* =========================================================================
          MODAL 1: COURSE DETAILS EDITOR (ADD / EDIT)
          ========================================================================= */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                  {editingCourse ? 'Edit Course Details' : 'Add New Masterclass Course'}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Updates sync instantly with student dashboards and storefront cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Course Title <span className="text-[#900606]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Instagram Mastery"
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Thumbnail Image (URL)
                </label>
                <input
                  type="text"
                  value={courseForm.image}
                  onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                  placeholder="e.g. /banner 5.png or ImageKit URL"
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Course Description <span className="text-[#900606]">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Comprehensive description of the mastery course..."
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Video Link / Stream URL (<code className="text-[#900606] font-mono text-[11px]">videoLink</code>)
                  </label>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    Anti-Copy &amp; DRM Protected
                  </span>
                </div>
                <input
                  type="text"
                  value={courseForm.videoLink || courseForm.videoUrl || ''}
                  onChange={(e) => setCourseForm({ ...courseForm, videoLink: e.target.value, videoUrl: e.target.value })}
                  placeholder="e.g. YouTube, Vimeo, Cloudinary, or direct MP4 URL"
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs font-mono"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Supports YouTube, Vimeo, Cloudinary, AWS S3, or direct .mp4 files with automatic anti-download DRM protection.
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="courseActiveCheckbox"
                  checked={courseForm.active}
                  onChange={(e) => setCourseForm({ ...courseForm, active: e.target.checked })}
                  className="w-4 h-4 rounded text-[#DC2626] focus:ring-[#900606]"
                />
                <label htmlFor="courseActiveCheckbox" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Publish Course Live (Visible to Enrolled Students)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: NESTED CURRICULUM MANAGER (MODULES & LESSONS)
          ========================================================================= */}
      {isCurriculumModalOpen && curriculumCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-5xl bg-white border border-neutral-200/90 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Top Header */}
            <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#900606] border border-red-100 flex items-center justify-center text-xl shrink-0">
                  {curriculumCourse.icon || '🎓'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#900606]">
                      Curriculum &amp; Video Manager
                    </span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-xs font-semibold text-neutral-500">
                      {curriculumModules.length} Modules •{' '}
                      {curriculumModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)} Lessons
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                    {curriculumCourse.title}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>+ Add Module</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCurriculumModalOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body: Left Modules Sidebar + Right Lessons Workspace */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden divide-y md:divide-y-0 md:divide-x divide-neutral-100">
              {/* Left Column: Modules List */}
              <div className="w-full md:w-80 p-4 sm:p-5 bg-neutral-50/40 overflow-y-auto space-y-2.5 shrink-0 max-h-[30vh] md:max-h-full">
                <div className="flex items-center justify-between pb-1 px-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Course Modules
                  </span>
                  <span className="text-xs font-bold text-neutral-600">
                    {curriculumModules.length} Total
                  </span>
                </div>

                {curriculumModules.map((mod, mIdx) => {
                  const isActive = activeModuleIndex === mIdx;
                  return (
                    <div
                      key={mIdx}
                      onClick={() => setActiveModuleIndex(mIdx)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                        isActive
                          ? 'bg-white border-[#900606] shadow-sm ring-1 ring-[#900606]/30 text-neutral-900'
                          : 'bg-white/70 border-neutral-200/80 hover:bg-white text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          isActive ? 'bg-red-50 text-[#900606]' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          Module {mIdx + 1}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newTitle = prompt('Rename module:', mod.moduleTitle);
                              if (newTitle) handleRenameModule(mIdx, newTitle);
                            }}
                            className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md"
                            title="Rename Module"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              requestDeleteModule(mIdx, mod.moduleTitle);
                            }}
                            className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                            title="Delete Module"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-bold truncate leading-snug">
                        {mod.moduleTitle}
                      </p>
                      <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-0.5">
                        <span>{mod.lessons?.length || 0} Lessons</span>
                        <span className="font-mono text-[10px]">
                          {(mod.lessons || []).reduce((acc, l) => acc + (l.resources?.length || 0), 0)} downloads
                        </span>
                      </div>
                    </div>
                  );
                })}

                {curriculumModules.length === 0 && (
                  <div className="py-8 text-center text-neutral-400 text-xs">
                    No modules yet. Click &quot;+ Add Module&quot; above.
                  </div>
                )}
              </div>

              {/* Right Column: Lessons inside Active Module */}
              <div className="flex-1 p-5 sm:p-7 overflow-y-auto space-y-5 bg-white">
                {curriculumModules[activeModuleIndex] ? (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#900606] block">
                          Module {activeModuleIndex + 1} Curriculum
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-neutral-900">
                          {curriculumModules[activeModuleIndex].moduleTitle}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenLessonModal(activeModuleIndex)}
                        className="bg-[#DC2626] hover:bg-[#C81E1E] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-2xs hover:shadow-xs inline-flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                      >
                        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span>+ Add Lesson</span>
                      </button>
                    </div>

                    {/* Lessons List in active module */}
                    <div className="space-y-3">
                      {curriculumModules[activeModuleIndex].lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id || lIdx}
                          className="p-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                            <span className="w-7 h-7 rounded-lg bg-white border border-neutral-200 text-neutral-700 text-xs font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                              {lIdx + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h5 className="font-bold text-neutral-900 text-xs sm:text-sm group-hover:text-[#900606] transition-colors">
                                  {lesson.title}
                                </h5>
                                {lesson.locked && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    🔒 Locked
                                  </span>
                                )}
                                {lesson.videoUrl ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    ▶ Video Stream Set
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-400">
                                    No Video URL
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                                <span>⏱ {lesson.duration || '10:00'}</span>
                                <span>•</span>
                                <span>{lesson.resources?.length || 0} Downloadable Files</span>
                                {lesson.videoUrl && (
                                  <>
                                    <span>•</span>
                                    <span className="font-mono text-[10px] truncate max-w-xs text-neutral-400">
                                      {lesson.videoUrl}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => handleOpenLessonModal(activeModuleIndex, lIdx)}
                              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:text-[#900606] hover:bg-neutral-200/70 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                requestDeleteLesson(activeModuleIndex, lIdx, lesson.title)
                              }
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Lesson"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}

                      {curriculumModules[activeModuleIndex].lessons.length === 0 && (
                        <div className="py-12 text-center text-neutral-400 rounded-2xl border border-dashed border-neutral-200">
                          <p className="text-xs font-bold text-neutral-600">No lessons in this module yet</p>
                          <p className="text-[11px] mt-1">
                            Click &quot;+ Add Lesson&quot; to configure the streaming video, duration, and study materials.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center text-neutral-400 text-xs">
                    Select or create a module on the left.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Save Bar */}
            <div className="px-6 py-4 sm:px-8 sm:py-4 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                Changes to modules and video URLs will update student portals immediately upon saving.
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCurriculumModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveCurriculum}
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSaving ? 'Syncing MongoDB...' : 'Save Curriculum Live'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: LESSON EDITOR (WITH VIDEO URL, DURATION, RESOURCES)
          ========================================================================= */}
      {isLessonModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white border border-neutral-200/90 rounded-2xl shadow-2xl p-6 sm:p-7 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-neutral-100">
              <div>
                <h4 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight">
                  {lessonTarget.lessonIndex !== null ? 'Edit Lesson' : 'Add New Lesson'}
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Configure streaming player URL, duration, overview notes, and student downloads.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsLessonModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    placeholder="e.g. 3-Second Visual Hook Formula"
                    className="w-full bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonForm.duration}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                    placeholder="e.g. 12:40"
                    className="w-full bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 outline-none focus:border-[#900606] transition-colors shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    Video Streaming Link (<code className="text-[#900606] font-mono text-[11px]">videoLink</code>)
                  </label>
                  <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                    DRM Protected
                  </span>
                </div>
                <input
                  type="text"
                  value={lessonForm.videoLink || lessonForm.videoUrl || ''}
                  onChange={(e) => setLessonForm({ ...lessonForm, videoLink: e.target.value, videoUrl: e.target.value })}
                  placeholder="e.g. https://domain.com/video.mp4, YouTube, Vimeo, or Cloudinary URL"
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs font-mono"
                />
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Plays in the secure player on user account (`/account?tab=courses`). Direct MP4s have download, inspection, and right-click blocked.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Lesson Overview &amp; Summary Notes
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.overview}
                  onChange={(e) => setLessonForm({ ...lessonForm, overview: e.target.value })}
                  placeholder="Summary of what the student will learn in this session..."
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={2}
                  value={lessonForm.keyTakeawaysText}
                  onChange={(e) => setLessonForm({ ...lessonForm, keyTakeawaysText: e.target.value })}
                  placeholder="3-Point visual hook: contrast, anchor, curiosity&#10;Waveform drop analysis"
                  className="w-full bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#900606] transition-colors shadow-2xs resize-none"
                />
              </div>

              {/* Downloadable Resources List */}
              <div className="pt-2 border-t border-neutral-100">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Downloadable Study Materials &amp; Resources ({lessonForm.resources.length})
                </label>

                {lessonForm.resources.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {lessonForm.resources.map((r, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs"
                      >
                        <div>
                          <span className="font-bold text-neutral-900">{r.title}</span>
                          <span className="text-neutral-400 text-[11px] ml-2 font-mono">
                            ({r.fileType} • {r.fileSize})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveResource(rIdx)}
                          className="text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Resource row */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-neutral-50/70 p-3 rounded-xl border border-neutral-200/80">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      placeholder="Resource name (e.g. Blueprint.pdf)"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newResource.fileSize}
                      onChange={(e) => setNewResource({ ...newResource, fileSize: e.target.value })}
                      placeholder="Size (e.g. 1.4 MB)"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 outline-none"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleAddResourceToLesson}
                      disabled={!newResource.title}
                      className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-40 cursor-pointer"
                    >
                      + Attach File
                    </button>
                  </div>
                </div>
              </div>

              {/* Locked Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lessonLockedCheckbox"
                  checked={lessonForm.locked}
                  onChange={(e) => setLessonForm({ ...lessonForm, locked: e.target.checked })}
                  className="w-4 h-4 rounded text-[#DC2626] focus:ring-[#900606]"
                />
                <label htmlFor="lessonLockedCheckbox" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Lock lesson (requires course progression or full bundle purchase)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsLessonModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#DC2626] hover:bg-[#C81E1E] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                >
                  Save Lesson to Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOM DELETE CONFIRMATION MODAL
          ========================================================================= */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          !deleteModal.isDeleting &&
          setDeleteModal({ isOpen: false, type: 'course', id: null, moduleIndex: null, lessonIndex: null, title: '', message: '', isDeleting: false })
        }
        onConfirm={handleConfirmDelete}
        title={deleteModal.title}
        message={deleteModal.message}
        isDeleting={deleteModal.isDeleting}
      />
    </div>
  );
}
