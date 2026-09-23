'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Lock,
  PlayCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  BookOpen,
  Eye,
  Lightbulb,
  Code2,
  ArrowRight,
  Clock,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
  Filter,
  Info
} from 'lucide-react';
import { KnowledgeGraphData, KnowledgeNodeData, NodeMasteryState } from '@/lib/types';

interface KnowledgeGraphViewProps {
  graphData: KnowledgeGraphData;
  onSelectNode: (node: KnowledgeNodeData) => void;
  onStartQuizForNode: (nodeId: string) => void;
  onOpenTutorForNode: (nodeId: string) => void;
  onOpenLessonForNode: (nodeId: string) => void;
}

export function KnowledgeGraphView({
  graphData,
  onSelectNode,
  onStartQuizForNode,
  onOpenTutorForNode,
  onOpenLessonForNode,
}: KnowledgeGraphViewProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(graphData.nodes[0]?.id || 'ai-01');
  const [activeModalTab, setActiveModalTab] = useState<'visual' | 'conceptual' | 'practice'>('visual');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterState, setFilterState] = useState<string>('ALL');
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedNode = graphData.nodes.find(n => n.id === selectedNodeId) || graphData.nodes[0];

  const filteredNodes = graphData.nodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterState === 'ALL' || node.progress.masteryState === filterState;
    return matchesSearch && matchesFilter;
  });

  const getNodeColor = (state: NodeMasteryState) => {
    switch (state) {
      case 'MASTERED':
        return {
          bg: 'bg-emerald-950/80',
          border: 'border-emerald-500/80',
          glow: 'shadow-emerald-500/20',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        };
      case 'IN_PROGRESS':
        return {
          bg: 'bg-indigo-950/80',
          border: 'border-indigo-500/80',
          glow: 'shadow-indigo-500/30',
          text: 'text-indigo-300',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        };
      case 'NEEDS_REVIEW':
        return {
          bg: 'bg-amber-950/80',
          border: 'border-amber-500/80',
          glow: 'shadow-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        };
      case 'AVAILABLE':
        return {
          bg: 'bg-cyan-950/80',
          border: 'border-cyan-500/60',
          glow: 'shadow-cyan-500/20',
          text: 'text-cyan-300',
          badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
        };
      case 'LOCKED':
      default:
        return {
          bg: 'bg-slate-900/60',
          border: 'border-slate-800',
          glow: 'shadow-transparent',
          text: 'text-slate-500',
          badge: 'bg-slate-800/40 text-slate-500 border-slate-700/30',
        };
    }
  };

  const getStatusIcon = (state: NodeMasteryState) => {
    switch (state) {
      case 'MASTERED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="w-4 h-4 text-indigo-400 animate-pulse" />;
      case 'NEEDS_REVIEW':
        return <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />;
      case 'AVAILABLE':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case 'LOCKED':
      default:
        return <Lock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Knowledge Frontier Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <span className="text-lg font-bold text-indigo-400">{graphData.overallMasteryPercentage}%</span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Overall Mastery</div>
            <div className="text-sm font-semibold text-slate-200">
              {graphData.masteredCount} of {graphData.nodes.length} Nodes
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Mastered</div>
            <div className="text-sm font-semibold text-slate-200">
              {graphData.masteredCount} Concepts
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Frontier</div>
            <div className="text-sm font-semibold text-slate-200">
              {graphData.inProgressCount} In Progress
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Retention Alert</div>
            <div className="text-sm font-semibold text-slate-200">
              {graphData.reviewCount} Needs Review
            </div>
          </div>
        </div>
      </div>

      {/* Main Graph Canvas & Node Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Graph Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px]">
          
          {/* Canvas Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 z-10">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter nodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-36 sm:w-48"
                />
              </div>

              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-300 py-1.5 px-2.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All States</option>
                <option value="MASTERED">Mastered</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="AVAILABLE">Available</option>
              </select>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setZoomLevel(Math.max(0.7, zoomLevel - 0.1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-mono text-slate-400 px-1">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 border-l border-slate-800"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Dynamic Interactive SVG DAG Visualizer */}
          <div className="relative flex-1 w-full h-[480px] overflow-auto flex items-center justify-center p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
            <div 
              className="relative transition-transform duration-200 origin-center"
              style={{
                transform: `scale(${zoomLevel})`,
                width: '1000px',
                height: '420px',
              }}
            >
              {/* SVG Edges connecting prerequisites */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker
                    id="arrowhead-active"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3.5, 0 7" fill="#6366F1" />
                  </marker>
                  <marker
                    id="arrowhead-dim"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3.5, 0 7" fill="#334155" />
                  </marker>
                </defs>

                {graphData.edges.map(edge => {
                  const srcNode = graphData.nodes.find(n => n.id === edge.source);
                  const tgtNode = graphData.nodes.find(n => n.id === edge.target);
                  if (!srcNode || !tgtNode) return null;

                  const isSourceMastered = srcNode.progress.masteryState === 'MASTERED';
                  const x1 = srcNode.graphX + 110;
                  const y1 = srcNode.graphY + 38;
                  const x2 = tgtNode.graphX;
                  const y2 = tgtNode.graphY + 38;
                  const midX = (x1 + x2) / 2;

                  return (
                    <path
                      key={edge.id}
                      d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
                      fill="none"
                      stroke={isSourceMastered ? '#6366F1' : '#334155'}
                      strokeWidth={isSourceMastered ? 2.5 : 1.5}
                      strokeDasharray={isSourceMastered ? 'none' : '4 4'}
                      markerEnd={isSourceMastered ? 'url(#arrowhead-active)' : 'url(#arrowhead-dim)'}
                      className="transition-all duration-300"
                    />
                  );
                })}
              </svg>

              {/* Node Cards on Canvas */}
              {filteredNodes.map(node => {
                const colors = getNodeColor(node.progress.masteryState);
                const isSelected = selectedNode?.id === node.id;
                const isLocked = node.progress.masteryState === 'LOCKED';

                return (
                  <div
                    key={node.id}
                    onClick={() => {
                      setSelectedNodeId(node.id);
                      onSelectNode(node);
                    }}
                    style={{
                      left: `${node.graphX}px`,
                      top: `${node.graphY}px`,
                    }}
                    className={`absolute w-52 p-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none z-10 ${
                      colors.bg
                    } ${colors.border} ${
                      isSelected
                        ? 'ring-2 ring-indigo-500 scale-105 shadow-2xl ' + colors.glow
                        : 'hover:scale-[1.02] shadow-lg'
                    } ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${colors.badge}`}>
                        {node.bloomLevel}
                      </span>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(node.progress.masteryState)}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                      {node.title}
                    </h4>

                    {/* Progress Bar & Probability */}
                    <div className="mt-2 pt-2 border-t border-slate-800/80">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-400">Mastery P(L)</span>
                        <span className="font-semibold text-slate-200 font-mono">
                          {Math.round(node.progress.masteryProbability * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            node.progress.masteryState === 'MASTERED'
                              ? 'bg-emerald-400'
                              : node.progress.masteryState === 'NEEDS_REVIEW'
                              ? 'bg-amber-400'
                              : 'bg-indigo-500'
                          }`}
                          style={{
                            width: `${Math.round(node.progress.masteryProbability * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Canvas Legend */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Mastered (≥85%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>In Progress</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Needs Review (Decay)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                <span>Locked</span>
              </div>
            </div>
            <div className="text-slate-500 text-[10px] hidden sm:block">
              Click any node to inspect multi-modal learning modalities
            </div>
          </div>
        </div>

        {/* Right Side: Active Node Detail Inspector & Multi-Modal Studio */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 shadow-2xl space-y-5">
          {selectedNode ? (
            <>
              {/* Header Info */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                    {selectedNode.courseTitle}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{selectedNode.estimatedMinutes} mins</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 mb-1.5">
                  {selectedNode.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* BKT & Ebbinghaus Telemetry Pill */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">BKT Posterior P(L)</div>
                  <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">
                    {Math.round(selectedNode.progress.masteryProbability * 100)}%
                  </div>
                </div>
                <div className="text-center border-x border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Retention R(t)</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {Math.round(selectedNode.progress.retrievabilityR * 100)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-medium">Stability S</div>
                  <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                    {selectedNode.progress.memoryStabilityS}d
                  </div>
                </div>
              </div>

              {/* Multi-Modal Content Tabs */}
              <div className="space-y-3">
                <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveModalTab('visual')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeModalTab === 'visual'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visual Model</span>
                  </button>

                  <button
                    onClick={() => setActiveModalTab('conceptual')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeModalTab === 'conceptual'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Deep Theory</span>
                  </button>

                  <button
                    onClick={() => setActiveModalTab('practice')}
                    className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      activeModalTab === 'practice'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Hands-On</span>
                  </button>
                </div>

                {/* Tab Content Panels */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs min-h-[170px]">
                  {activeModalTab === 'visual' && (
                    <div className="space-y-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs leading-relaxed">
                        <span className="font-semibold block mb-1">🧠 Intuitive Mental Model:</span>
                        {selectedNode.content.visual.mentalModel}
                      </div>

                      <div className="space-y-1.5">
                        <span className="font-semibold text-slate-300">Key Visual Takeaways:</span>
                        <ul className="space-y-1 text-slate-400 pl-4 list-disc">
                          {selectedNode.content.visual.summaryBullets.map((bullet, i) => (
                            <li key={i}>{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeModalTab === 'conceptual' && (
                    <div className="space-y-3">
                      <p className="text-slate-300 leading-relaxed">
                        {selectedNode.content.conceptual.deepTheory}
                      </p>

                      {selectedNode.content.conceptual.mathematicalFormula && (
                        <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-center text-indigo-300 text-[11px] overflow-x-auto">
                          {selectedNode.content.conceptual.mathematicalFormula}
                        </div>
                      )}

                      {selectedNode.content.conceptual.formulaExplanation && (
                        <p className="text-[11px] text-slate-400 italic">
                          {selectedNode.content.conceptual.formulaExplanation}
                        </p>
                      )}
                    </div>
                  )}

                  {activeModalTab === 'practice' && (
                    <div className="space-y-3">
                      {selectedNode.content.practice.codingChallenge ? (
                        <div>
                          <div className="font-semibold text-slate-200 mb-1">
                            {selectedNode.content.practice.codingChallenge.title}
                          </div>
                          <p className="text-slate-400 mb-2">
                            {selectedNode.content.practice.codingChallenge.instructions}
                          </p>
                          <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto">
                            {selectedNode.content.practice.codingChallenge.starterCode}
                          </pre>
                        </div>
                      ) : (
                        <div className="text-slate-400">
                          Interactive walkthrough available for this node.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => onStartQuizForNode(selectedNode.id)}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-xs transition-colors shadow-lg shadow-indigo-600/20"
                >
                  <Zap className="w-4 h-4" />
                  <span>Adaptive Quiz</span>
                </button>

                <button
                  onClick={() => onOpenTutorForNode(selectedNode.id)}
                  className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Ask AI Mentor</span>
                </button>
              </div>

              <button
                onClick={() => onOpenLessonForNode(selectedNode.id)}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl text-xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Full Lesson Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a node from the knowledge graph to inspect details.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
