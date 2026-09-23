'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { KnowledgeGraphView } from '@/components/KnowledgeGraphView';
import { AdaptiveQuizEngine } from '@/components/AdaptiveQuizEngine';
import { AITutorView } from '@/components/AITutorView';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { LessonReader } from '@/components/LessonReader';
import { ArchitectureDocs } from '@/components/ArchitectureDocs';
import { DiagnosticModal } from '@/components/DiagnosticModal';
import { LearningStyleModal } from '@/components/LearningStyleModal';
import {
  DEFAULT_USER,
  INITIAL_PROGRESS,
  buildKnowledgeGraph
} from '@/lib/store';
import {
  KnowledgeNodeData,
  LearningStyle,
  StudentProgressData,
  UserProfileData
} from '@/lib/types';
import { COURSES } from '@/lib/curriculum-data';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'graph' | 'quiz' | 'tutor' | 'analytics' | 'lesson' | 'architecture'>('graph');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-ai-ml');
  const [focusedNodeId, setFocusedNodeId] = useState<string>('ai-01');
  const [userProfile, setUserProfile] = useState<UserProfileData>(DEFAULT_USER);
  const [progressState, setProgressState] = useState<Record<string, StudentProgressData>>(INITIAL_PROGRESS);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [styleModalOpen, setStyleModalOpen] = useState(false);

  // Compute graph dynamically
  const graphData = buildKnowledgeGraph(selectedCourseId, progressState);

  // Handlers
  const handleSelectNode = (node: KnowledgeNodeData) => {
    setFocusedNodeId(node.id);
  };

  const handleStartQuizForNode = (nodeId: string) => {
    setFocusedNodeId(nodeId);
    setActiveTab('quiz');
  };

  const handleOpenTutorForNode = (nodeId: string) => {
    setFocusedNodeId(nodeId);
    setActiveTab('tutor');
  };

  const handleOpenLessonForNode = (nodeId: string) => {
    setFocusedNodeId(nodeId);
    setActiveTab('lesson');
  };

  const handleUpdateUserStats = (
    newXp: number,
    newTheta: number,
    updatedMasteryNode?: { nodeId: string; newProb: number }
  ) => {
    const newLevel = Math.floor(newXp / 500) + 1;
    setUserProfile(prev => ({
      ...prev,
      totalXp: newXp,
      level: newLevel,
      globalAbilityTheta: newTheta,
    }));

    if (updatedMasteryNode) {
      setProgressState(prev => {
        const current = prev[updatedMasteryNode.nodeId] || {
          nodeId: updatedMasteryNode.nodeId,
          masteryState: 'AVAILABLE' as const,
          masteryProbability: 0.1,
          memoryStabilityS: 1.0,
          retrievabilityR: 1.0,
          lastReviewedAt: new Date().toISOString(),
          nextReviewDueDate: new Date().toISOString(),
          attemptsCount: 0,
          correctCount: 0,
          consecutiveCorrect: 0,
          timeSpentSeconds: 0,
        };

        const newState = updatedMasteryNode.newProb >= 0.85 ? 'MASTERED' : 'IN_PROGRESS';

        return {
          ...prev,
          [updatedMasteryNode.nodeId]: {
            ...current,
            masteryProbability: updatedMasteryNode.newProb,
            masteryState: newState,
            lastReviewedAt: new Date().toISOString(),
          },
        };
      });
    }
  };

  const handleCompleteDiagnostic = (
    score: number,
    estimatedTheta: number,
    style: LearningStyle
  ) => {
    setUserProfile(prev => ({
      ...prev,
      diagnosticCompleted: true,
      diagnosticScore: score,
      globalAbilityTheta: estimatedTheta,
      preferredStyle: style,
      totalXp: prev.totalXp + 200,
    }));
  };

  const handleUpdateLearningStyle = (style: LearningStyle) => {
    setUserProfile(prev => ({
      ...prev,
      preferredStyle: style,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCourseId={selectedCourseId}
        setSelectedCourseId={setSelectedCourseId}
        userProfile={userProfile}
        onOpenDiagnostic={() => setDiagnosticOpen(true)}
        onOpenStyleModal={() => setStyleModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'graph' && (
          <KnowledgeGraphView
            graphData={graphData}
            onSelectNode={handleSelectNode}
            onStartQuizForNode={handleStartQuizForNode}
            onOpenTutorForNode={handleOpenTutorForNode}
            onOpenLessonForNode={handleOpenLessonForNode}
          />
        )}

        {activeTab === 'quiz' && (
          <AdaptiveQuizEngine
            initialNodeId={focusedNodeId}
            userProfile={userProfile}
            onUpdateUserStats={handleUpdateUserStats}
            onOpenTutor={handleOpenTutorForNode}
          />
        )}

        {activeTab === 'tutor' && (
          <AITutorView
            initialNodeId={focusedNodeId}
            userProfile={userProfile}
            onUpdateLearningStyle={handleUpdateLearningStyle}
            onStartQuiz={handleStartQuizForNode}
          />
        )}

        {activeTab === 'lesson' && (
          <LessonReader
            initialNodeId={focusedNodeId}
            preferredStyle={userProfile.preferredStyle}
            onStartQuiz={handleStartQuizForNode}
            onAskTutor={handleOpenTutorForNode}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            userProfile={userProfile}
            onOpenQuiz={handleStartQuizForNode}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureDocs />
        )}
      </main>

      {/* Modals */}
      <DiagnosticModal
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
        onCompleteDiagnostic={handleCompleteDiagnostic}
      />

      <LearningStyleModal
        isOpen={styleModalOpen}
        onClose={() => setStyleModalOpen(false)}
        currentStyle={userProfile.preferredStyle}
        onSelectStyle={handleUpdateLearningStyle}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">SynapseAI</span>
            <span>—</span>
            <span>AI-Powered Adaptive Learning & Knowledge Engineering Platform</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>PostgreSQL + pgvector</span>
            <span>•</span>
            <span>Bayesian Knowledge Tracing (BKT)</span>
            <span>•</span>
            <span>IRT 3PL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
