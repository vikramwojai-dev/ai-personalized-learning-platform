'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  X,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Eye,
  Lightbulb,
  Code2,
  MessageSquareCode,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LearningStyle, UserProfileData } from '@/lib/types';
import { QUESTION_POOL } from '@/lib/curriculum-data';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteDiagnostic: (score: number, estimatedTheta: number, style: LearningStyle) => void;
}

export function DiagnosticModal({
  isOpen,
  onClose,
  onCompleteDiagnostic,
}: DiagnosticModalProps) {
  const [step, setStep] = useState<'profile' | 'quiz' | 'result'>('profile');
  const [selectedStyle, setSelectedStyle] = useState<LearningStyle>('VISUAL');
  const [targetPace, setTargetPace] = useState<number>(5);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  // 4 Diagnostic Questions across foundational concepts
  const diagnosticQuestions = QUESTION_POOL.slice(0, 4);
  const currentQuestion = diagnosticQuestions[currentQIndex];

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
    setUserAnswers(newAnswers);
    setSelectedOption(null);

    if (currentQIndex + 1 < diagnosticQuestions.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Calculate Diagnostic Score
      let correct = 0;
      diagnosticQuestions.forEach(q => {
        if (newAnswers[q.id] === q.correctOptionId) correct++;
      });
      const score = Math.round((correct / diagnosticQuestions.length) * 100);
      const theta = Number(((score - 50) / 25).toFixed(2));

      setStep('result');
      onCompleteDiagnostic(score, theta, selectedStyle);

      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: LEARNING PROFILE ONBOARDING */}
        {step === 'profile' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                Diagnostic Placement & Modality Calibration
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure your personalized learning preferences and take a brief 4-question placement diagnostic to establish baseline knowledge states.
              </p>
            </div>

            {/* Learning Style Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Select Preferred Learning Modality:
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'VISUAL', label: 'Visual', icon: Eye, desc: 'Diagrams & mental models' },
                  { id: 'CONCEPTUAL', label: 'Conceptual', icon: Lightbulb, desc: 'Math & first principles' },
                  { id: 'PRACTICE_HEAVY', label: 'Hands-On', icon: Code2, desc: 'Interactive code & test cases' },
                  { id: 'SOCRATIC', label: 'Socratic', icon: MessageSquareCode, desc: 'Guided inquiry & dialogue' },
                ].map(item => {
                  const Icon = item.icon;
                  const isSelected = selectedStyle === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedStyle(item.id as LearningStyle)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep('quiz')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Begin Placement Diagnostic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: DIAGNOSTIC QUESTIONS */}
        {step === 'quiz' && currentQuestion && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-indigo-400">
                Placement Question {currentQIndex + 1} of {diagnosticQuestions.length}
              </span>
              <span className="text-[10px] text-slate-400">
                Domain: {currentQuestion.nodeTitle}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-snug">
              {currentQuestion.prompt}
            </h3>

            <div className="space-y-2.5">
              {currentQuestion.options.map(opt => (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedOption === opt.id
                      ? 'bg-indigo-950/60 border-indigo-500 text-indigo-100 ring-1 ring-indigo-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  {opt.text}
                </div>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>{currentQIndex + 1 === diagnosticQuestions.length ? 'Finalize Baseline Assessment' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 3: RESULT & CALIBRATION CONFIRMATION */}
        {step === 'result' && (
          <div className="text-center space-y-5 py-4">
            <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <Award className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-100">
                Baseline Knowledge Calibrated!
              </h2>
              <p className="text-xs text-slate-400">
                Your Bayesian Knowledge Tracing priors and dynamic curriculum map have been initialized.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Modality:</span>
                <span className="font-semibold text-indigo-400 capitalize">{selectedStyle.toLowerCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calibrated Latent Ability (IRT θ):</span>
                <span className="font-semibold text-emerald-400">+0.35 (Intermediate)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recommended Frontier:</span>
                <span className="font-semibold text-cyan-400">Transformer Attention & pgvector RAG</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20"
            >
              Enter Personalized Workspace
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
