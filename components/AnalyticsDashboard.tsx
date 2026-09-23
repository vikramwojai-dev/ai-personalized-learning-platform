'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Clock,
  Flame,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { UserProfileData, StudentProgressData, SpacedRepetitionItem } from '@/lib/types';
import { INITIAL_PROGRESS, getSpacedRepetitionQueue } from '@/lib/store';
import { calculateRetention, updateMemoryStability } from '@/lib/algorithms/forgetting-curve';
import { KNOWLEDGE_NODES } from '@/lib/curriculum-data';

interface AnalyticsDashboardProps {
  userProfile: UserProfileData;
  onOpenQuiz: (nodeId?: string) => void;
}

export function AnalyticsDashboard({ userProfile, onOpenQuiz }: AnalyticsDashboardProps) {
  const [selectedNodeForDecay, setSelectedNodeForDecay] = useState<string>('ai-01');
  const [spacedQueue, setSpacedQueue] = useState<SpacedRepetitionItem[]>(() =>
    getSpacedRepetitionQueue(INITIAL_PROGRESS)
  );
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Forgetting curve data for selected node
  const activeNodeProgress = INITIAL_PROGRESS[selectedNodeForDecay] || INITIAL_PROGRESS['ai-01'];
  const retentionInfo = calculateRetention(
    activeNodeProgress.lastReviewedAt,
    activeNodeProgress.memoryStabilityS
  );

  const weeklyVelocityData = [
    { day: 'Mon', minutes: 45, xp: 180 },
    { day: 'Tue', minutes: 60, xp: 240 },
    { day: 'Wed', minutes: 30, xp: 120 },
    { day: 'Thu', minutes: 75, xp: 310 },
    { day: 'Fri', minutes: 50, xp: 200 },
    { day: 'Sat', minutes: 90, xp: 370 },
    { day: 'Sun', minutes: 40, xp: 150 },
  ];

  const radarData = [
    { subject: 'Linear Algebra', score: 92, fullMark: 100 },
    { subject: 'Optimization', score: 87, fullMark: 100 },
    { subject: 'Transformers', score: 64, fullMark: 100 },
    { subject: 'RAG & pgvector', score: 45, fullMark: 100 },
    { subject: 'Agentic Workflows', score: 35, fullMark: 100 },
    { subject: 'Alignment (RLHF)', score: 20, fullMark: 100 },
  ];

  const handleRateCard = (rating: 1 | 2 | 3 | 4) => {
    const card = spacedQueue[activeCardIndex];
    if (!card) return;

    const newStability = updateMemoryStability(card.stability, rating);

    setSpacedQueue(prev =>
      prev.map((item, idx) =>
        idx === activeCardIndex
          ? {
              ...item,
              stability: newStability,
              retrievability: rating >= 3 ? 0.95 : 0.60,
              isDue: rating < 3,
            }
          : item
      )
    );

    setIsFlipped(false);
    setActiveCardIndex(prev => (prev + 1) % (spacedQueue.length || 1));
  };

  const currentCard = spacedQueue[activeCardIndex];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Learning Science KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Memory Stability (Avg)</span>
            <Brain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">3.8 Days</div>
          <p className="text-[10px] text-cyan-400">+1.2d post active recall</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Global Retention Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">86.4%</div>
          <p className="text-[10px] text-emerald-400">Above 85% target threshold</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Learning Velocity</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">5.2 hrs/wk</div>
          <p className="text-[10px] text-amber-400">Streak: {userProfile.currentStreakDays} days</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Cognitive Load Index</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">Zone of Proximal Dev</div>
          <p className="text-[10px] text-purple-400">IRT θ calibrated at {userProfile.globalAbilityTheta.toFixed(2)}</p>
        </div>
      </div>

      {/* Middle Row: Ebbinghaus Forgetting Curve & Spaced Repetition Flashcard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Ebbinghaus Forgetting Curve */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Ebbinghaus Forgetting Curve & Retention Forecast</span>
              </h3>
              <p className="text-xs text-slate-400">
                Mathematical decay model: <code className="text-indigo-300 font-mono">R(t) = exp(-t / S)</code>
              </p>
            </div>

            <select
              value={selectedNodeForDecay}
              onChange={(e) => setSelectedNodeForDecay(e.target.value)}
              className="text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-3 focus:outline-none focus:border-indigo-500"
            >
              {Object.values(KNOWLEDGE_NODES).map(node => (
                <option key={node.id} value={node.id}>
                  {node.title}
                </option>
              ))}
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={retentionInfo.predictedDecayCurve}>
                <defs>
                  <linearGradient id="retentionGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" textAnchor="end" unit="d" />
                <YAxis domain={[0, 100]} stroke="#64748b" unit="%" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}% Retention`, 'Predicted Recall']}
                  labelFormatter={(label) => `Day ${label} after study`}
                />
                <Area type="monotone" dataKey="retentionPct" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#retentionGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400">Current Retrievability:</span>
              <div className="font-bold text-slate-200 font-mono">
                {Math.round(retentionInfo.retrievabilityR * 100)}% ({retentionInfo.daysElapsed} days since last review)
              </div>
            </div>

            <div className="space-y-0.5 text-right">
              <span className="text-slate-400">Optimal Review Window:</span>
              <div className="font-bold text-cyan-400 font-mono">
                In {retentionInfo.optimalNextReviewDays} days
              </div>
            </div>
          </div>
        </div>

        {/* Right: Spaced Repetition Review Deck */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-purple-400" />
                <span>Active Recall Spaced Repetition</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                Card {activeCardIndex + 1} of {spacedQueue.length}
              </span>
            </div>

            {/* Flip Card Container */}
            {currentCard ? (
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="mt-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer min-h-[220px] flex flex-col justify-between hover:border-slate-700 transition-all select-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase">
                      {currentCard.nodeTitle}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {isFlipped ? 'Click to show front' : 'Click to flip answer'}
                    </span>
                  </div>

                  {!isFlipped ? (
                    <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed pt-2">
                      {currentCard.frontPrompt}
                    </p>
                  ) : (
                    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {currentCard.backExplanation}
                      </p>
                      {currentCard.codeSnippet && (
                        <pre className="p-2 bg-slate-950 rounded-lg text-[10px] font-mono text-emerald-400 overflow-x-auto">
                          {currentCard.codeSnippet}
                        </pre>
                      )}
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Stability S: {currentCard.stability}d</span>
                  <span>Retrievability: {Math.round(currentCard.retrievability * 100)}%</span>
                </div>
              </div>
            ) : null}
          </div>

          {/* Rating Buttons (SM-2 / FSRS) */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => handleRateCard(1)}
              className="py-2 px-1 text-[11px] font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              Again (1d)
            </button>
            <button
              onClick={() => handleRateCard(2)}
              className="py-2 px-1 text-[11px] font-semibold rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-colors"
            >
              Hard (2d)
            </button>
            <button
              onClick={() => handleRateCard(3)}
              className="py-2 px-1 text-[11px] font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition-colors"
            >
              Good (4d)
            </button>
            <button
              onClick={() => handleRateCard(4)}
              className="py-2 px-1 text-[11px] font-semibold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-colors"
            >
              Easy (7d)
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Learning Velocity & Domain Mastery Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Learning Velocity */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Weekly Learning Velocity (Minutes per Day)</span>
            </h3>
            <span className="text-xs text-slate-400">Total: 390 mins this week</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyVelocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" unit="m" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any) => [`${value} minutes`, 'Study Time']}
                />
                <Bar dataKey="minutes" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Mastery Radar */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Domain Knowledge Matrix</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">6 Subdomains</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Mastery" dataKey="score" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
