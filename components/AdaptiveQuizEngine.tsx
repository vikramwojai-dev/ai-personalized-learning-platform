'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Brain,
  Award,
  Clock,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuestionData, QuestionDifficulty, UserProfileData } from '@/lib/types';
import { QUESTION_POOL, KNOWLEDGE_NODES } from '@/lib/curriculum-data';
import { updateBKT } from '@/lib/algorithms/bkt';
import { updateStudentTheta } from '@/lib/algorithms/irt';

interface AdaptiveQuizEngineProps {
  initialNodeId?: string;
  userProfile: UserProfileData;
  onUpdateUserStats: (newXp: number, newTheta: number, updatedMasteryNode?: { nodeId: string; newProb: number }) => void;
  onOpenTutor: (nodeId: string) => void;
}

export function AdaptiveQuizEngine({
  initialNodeId,
  userProfile,
  onUpdateUserStats,
  onOpenTutor,
}: AdaptiveQuizEngineProps) {
  const [selectedNodeFilter, setSelectedNodeFilter] = useState<string>(initialNodeId || 'ALL');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentHintLevel, setCurrentHintLevel] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [sessionScore, setSessionScore] = useState({ correct: 0, total: 0 });
  const [currentTheta, setCurrentTheta] = useState(userProfile.globalAbilityTheta || 0.2);
  const [lastBktUpdate, setLastBktUpdate] = useState<{
    deltaMastery: number;
    updatedMastery: number;
    deltaTheta: number;
    xpGained: number;
  } | null>(null);

  // Filter question pool
  const filteredQuestions = React.useMemo(() => {
    if (selectedNodeFilter === 'ALL') return QUESTION_POOL;
    const filtered = QUESTION_POOL.filter(q => q.nodeId === selectedNodeFilter);
    return filtered.length > 0 ? filtered : QUESTION_POOL;
  }, [selectedNodeFilter]);

  const currentQuestion = filteredQuestions[currentQuestionIndex % filteredQuestions.length];
  const activeNode = KNOWLEDGE_NODES[currentQuestion?.nodeId];

  // Timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isSubmitted) {
        setTimerSeconds(s => s + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isSubmitted]);

  // Handle Option Submission
  const handleSubmitAnswer = async () => {
    if (!selectedOptionId || isSubmitted) return;

    const isCorrect = selectedOptionId === currentQuestion.correctOptionId;
    setIsSubmitted(true);

    const bktParams = activeNode ? activeNode.bktParams : { pL0: 0.15, pT: 0.18, pS: 0.08, pG: 0.20 };
    const initialMastery = 0.50;
    const bktResult = updateBKT(initialMastery, isCorrect, bktParams);

    const irtResult = updateStudentTheta(currentTheta, isCorrect, currentQuestion.irt);
    setCurrentTheta(irtResult.newTheta);

    const xpGained = isCorrect ? Math.max(15, 60 - currentHintLevel * 15) : 10;

    setLastBktUpdate({
      deltaMastery: bktResult.deltaMastery,
      updatedMastery: bktResult.updatedMastery,
      deltaTheta: irtResult.deltaTheta,
      xpGained,
    });

    setSessionScore(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    onUpdateUserStats(
      userProfile.totalXp + xpGained,
      irtResult.newTheta,
      { nodeId: currentQuestion.nodeId, newProb: bktResult.updatedMastery }
    );

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366F1', '#10B981', '#06B6D4', '#F59E0B'],
      });
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setCurrentHintLevel(0);
    setTimerSeconds(0);
    setLastBktUpdate(null);
    setCurrentQuestionIndex(idx => idx + 1);
  };

  const getDifficultyBadge = (diff: QuestionDifficulty) => {
    switch (diff) {
      case 'NOVICE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INTERMEDIATE':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'ADVANCED':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'EXPERT':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Quiz Top Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-100">Adaptive Quiz Arena</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                IRT θ: {currentTheta.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Questions calibrated in real time to your knowledge frontiers
            </p>
          </div>
        </div>

        {/* Node Filter Selector */}
        <div className="flex items-center space-x-3">
          <select
            value={selectedNodeFilter}
            onChange={(e) => {
              setSelectedNodeFilter(e.target.value);
              setCurrentQuestionIndex(0);
              setIsSubmitted(false);
              setSelectedOptionId(null);
            }}
            className="text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-3 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Topics (Full Adaptive Mix)</option>
            {Object.values(KNOWLEDGE_NODES).map(node => (
              <option key={node.id} value={node.id}>
                {node.title}
              </option>
            ))}
          </select>

          {/* Session Progress Stats */}
          <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-200">
              {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Question Card */}
      {currentQuestion ? (
        <div className="bg-slate-950 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-2">
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${getDifficultyBadge(currentQuestion.difficulty)}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="text-xs text-slate-400">
                Node: <strong className="text-slate-200">{currentQuestion.nodeTitle}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span>Question {(currentQuestionIndex % filteredQuestions.length) + 1} of {filteredQuestions.length}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold">{sessionScore.correct} Correct</span>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-100 leading-snug">
              {currentQuestion.prompt}
            </h3>

            {currentQuestion.codeSnippet && (
              <pre className="p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-slate-200 overflow-x-auto">
                {currentQuestion.codeSnippet}
              </pre>
            )}
          </div>

          {/* Socratic Hint Drawer */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-semibold text-slate-200">Socratic Hint Ladder</span>
              </div>
              
              {!isSubmitted && (
                <button
                  onClick={() => setCurrentHintLevel(l => Math.min(3, l + 1))}
                  disabled={currentHintLevel >= 3}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                >
                  {currentHintLevel === 0 ? 'Request Level 1 Hint' : currentHintLevel < 3 ? `Escalate to Level ${currentHintLevel + 1}` : 'All Hints Revealed'}
                </button>
              )}
            </div>

            {currentHintLevel > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                {currentHintLevel >= 1 && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300">
                    <strong>Level 1 (Guiding Question):</strong> {currentQuestion.hints.level1}
                  </div>
                )}
                {currentHintLevel >= 2 && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200">
                    <strong>Level 2 (Conceptual Clue):</strong> {currentQuestion.hints.level2}
                  </div>
                )}
                {currentHintLevel >= 3 && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-100">
                    <strong>Level 3 (Worked Analogy):</strong> {currentQuestion.hints.level3}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Options Selection List */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectOption = option.id === currentQuestion.correctOptionId;

              let optionStyle = 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200';

              if (isSubmitted) {
                if (isCorrectOption) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = 'bg-rose-950/60 border-rose-500/80 text-rose-200 ring-1 ring-rose-500';
                } else {
                  optionStyle = 'bg-slate-900/40 border-slate-800/50 text-slate-500';
                }
              } else if (isSelected) {
                optionStyle = 'bg-indigo-950/60 border-indigo-500 text-indigo-100 ring-2 ring-indigo-500';
              }

              return (
                <div
                  key={option.id}
                  onClick={() => !isSubmitted && setSelectedOptionId(option.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${optionStyle}`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isSubmitted ? (
                      isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-700" />
                      )
                    ) : (
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700'}`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-xs sm:text-sm leading-relaxed">
                    <span>{option.text}</span>
                    {isSubmitted && (isCorrectOption || isSelected) && (
                      <p className="mt-2 text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                        {option.explanation}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Post-Submission Feedback & BKT Delta Card */}
          {isSubmitted && lastBktUpdate && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Assessment Telemetry & BKT Update
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="text-emerald-400 font-semibold font-mono">
                    +{lastBktUpdate.xpGained} XP
                  </span>
                  <span className="text-indigo-400 font-semibold font-mono">
                    Δθ: {lastBktUpdate.deltaTheta >= 0 ? '+' : ''}{lastBktUpdate.deltaTheta}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Bayesian Posterior P(L)</span>
                  <span className="font-bold text-indigo-400 font-mono text-sm">
                    {Math.round(lastBktUpdate.updatedMastery * 100)}%
                  </span>
                  <span className="text-[10px] text-emerald-400 block">
                    ({lastBktUpdate.deltaMastery >= 0 ? '+' : ''}{Math.round(lastBktUpdate.deltaMastery * 100)}% shift)
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Latent Ability (IRT θ)</span>
                  <span className="font-bold text-cyan-400 font-mono text-sm">
                    {currentTheta.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Calibrated 3PL</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Cognitive Retention</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">
                    Optimal ZPD
                  </span>
                  <span className="text-[10px] text-slate-400 block">Next review in 3.5d</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-slate-200 block mb-1">Deep Explanation:</strong>
                {currentQuestion.detailedExplanation}
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => onOpenTutor(currentQuestion.nodeId)}
              className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-purple-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Discuss with AI Tutor</span>
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedOptionId}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                <span>Submit Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center space-x-2"
              >
                <span>Next Adaptive Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800 text-slate-400 text-xs">
          No questions available for the selected topic filter.
        </div>
      )}

    </div>
  );
}
