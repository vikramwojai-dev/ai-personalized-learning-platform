'use client';

import React from 'react';
import {
  Brain,
  Network,
  Sparkles,
  Flame,
  Zap,
  BarChart3,
  BookOpen,
  Layers,
  ChevronDown,
  Compass,
  GraduationCap,
  Code2,
  Eye,
  Lightbulb,
  MessageSquareCode
} from 'lucide-react';
import { COURSES } from '@/lib/curriculum-data';
import { LearningStyle, UserProfileData } from '@/lib/types';

interface NavbarProps {
  activeTab: 'graph' | 'quiz' | 'tutor' | 'analytics' | 'lesson' | 'architecture';
  setActiveTab: (tab: 'graph' | 'quiz' | 'tutor' | 'analytics' | 'lesson' | 'architecture') => void;
  selectedCourseId: string;
  setSelectedCourseId: (courseId: string) => void;
  userProfile: UserProfileData;
  onOpenDiagnostic: () => void;
  onOpenStyleModal: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  selectedCourseId,
  setSelectedCourseId,
  userProfile,
  onOpenDiagnostic,
  onOpenStyleModal,
}: NavbarProps) {
  const [courseDropdownOpen, setCourseDropdownOpen] = React.useState(false);
  const currentCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  const getStyleIcon = (style: LearningStyle) => {
    switch (style) {
      case 'VISUAL':
        return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
      case 'CONCEPTUAL':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-400" />;
      case 'PRACTICE_HEAVY':
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'SOCRATIC':
        return <MessageSquareCode className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Course Selector */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => setActiveTab('graph')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                    SynapseAI
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">Adaptive Learning System</p>
              </div>
            </div>

            {/* Course Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCourseDropdownOpen(!courseDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 transition-colors"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: currentCourse.accentColor }}
                />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">{currentCourse.title}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {courseDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Select Track
                  </div>
                  {COURSES.map(course => (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.id);
                        setCourseDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center space-x-2.5 transition-colors ${
                        course.id === selectedCourseId
                          ? 'bg-indigo-600/15 text-indigo-300 font-medium'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: course.accentColor }}
                      />
                      <div className="truncate">
                        <div className="font-medium text-slate-200">{course.title}</div>
                        <div className="text-[10px] text-slate-400 truncate">{course.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('graph')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Adaptive Quiz</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'tutor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>

            <button
              onClick={() => setActiveTab('lesson')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'lesson'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Lesson Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics & Retention</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>System Design</span>
            </button>
          </nav>

          {/* Right Action & Telemetry Badges */}
          <div className="flex items-center space-x-2.5">
            {/* Learning Style Pill */}
            <button
              onClick={onOpenStyleModal}
              title="Click to adjust personalized learning modality"
              className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 transition-colors"
            >
              {getStyleIcon(userProfile.preferredStyle)}
              <span className="capitalize">{userProfile.preferredStyle.toLowerCase().replace('_', ' ')}</span>
            </button>

            {/* Streak Badge */}
            <div 
              title={`${userProfile.currentStreakDays} day learning streak!`}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
              <span>{userProfile.currentStreakDays}d</span>
            </div>

            {/* XP / Level Badge */}
            <div 
              title={`Level ${userProfile.level} • ${userProfile.totalXp} XP`}
              className="hidden sm:flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span>{userProfile.totalXp} XP</span>
            </div>

            {/* Diagnostic Button */}
            <button
              onClick={onOpenDiagnostic}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg shadow-sm shadow-indigo-500/20 transition-all hover:scale-[1.02]"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Placement Quiz</span>
              <span className="md:hidden">Quiz</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto space-x-2 py-2 border-t border-slate-900 no-scrollbar">
          {[
            { id: 'graph', label: 'Graph', icon: Network },
            { id: 'quiz', label: 'Adaptive Quiz', icon: Zap },
            { id: 'tutor', label: 'AI Tutor', icon: Sparkles },
            { id: 'lesson', label: 'Lesson Studio', icon: BookOpen },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'architecture', label: 'System Design', icon: Layers },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium rounded-lg shrink-0 ${
                  activeTab === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
