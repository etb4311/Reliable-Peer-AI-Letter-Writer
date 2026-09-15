import React from 'react';
import { Sparkles, RefreshCw, SlidersHorizontal, Check, User, GraduationCap, FileEdit, HeartPulse } from 'lucide-react';
import { ScenarioPreset } from '../types';
import { DEFAULT_SCENARIO_PRESETS } from '../data/roleCard';

interface InputPanelProps {
  studentName: string;
  setStudentName: (val: string) => void;
  professorName: string;
  setProfessorName: (val: string) => void;
  course: string;
  setCourse: (val: string) => void;
  initialAsk: string;
  setInitialAsk: (val: string) => void;
  desiredOutput: string;
  setDesiredOutput: (val: string) => void;
  symptoms: string;
  setSymptoms: (val: string) => void;
  additionalInfo: string;
  setAdditionalInfo: (val: string) => void;
  tone: 'direct' | 'respectful' | 'expressive' | 'formal';
  setTone: (val: 'direct' | 'respectful' | 'expressive' | 'formal') => void;
  onApplyPreset: (preset: ScenarioPreset) => void;
  onSubmitConsult: () => void;
  isLoading: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  studentName,
  setStudentName,
  professorName,
  setProfessorName,
  course,
  setCourse,
  initialAsk,
  setInitialAsk,
  desiredOutput,
  setDesiredOutput,
  symptoms,
  setSymptoms,
  additionalInfo,
  setAdditionalInfo,
  tone,
  setTone,
  onApplyPreset,
  onSubmitConsult,
  isLoading
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-5">
      {/* Top Header with Presets dropdown or pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            Quick Scenario Presets
          </label>
          <span className="text-[11px] text-slate-400">Click to auto-populate</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {DEFAULT_SCENARIO_PRESETS.map((preset) => {
            const isCurrent = preset.studentName === studentName && preset.professorName === professorName;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onApplyPreset(preset)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {preset.title.split(' ')[0] === 'Yuwen' ? '★ ' : ''}
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Required Role Card Inputs */}
      <div className="space-y-4">
        {/* Core characters & context */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Student (You)
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Yuwen"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
              Professor / Recipient
            </label>
            <input
              type="text"
              value={professorName}
              onChange={(e) => setProfessorName(e.target.value)}
              placeholder="e.g. Hugh"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Course / Studio
            </label>
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. DES INV 200"
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Input 1: Initial Ask */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
              Initial Ask <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Required by Role Card</span>
          </div>
          <textarea
            value={initialAsk}
            onChange={(e) => setInitialAsk(e.target.value)}
            rows={2}
            placeholder="e.g. I have a 102 fever and need to miss Hugh's studio review today. How should I write to him without sounding like I'm slacking?"
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50 resize-none leading-relaxed"
          />
        </div>

        {/* Input 2: Specific Output */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">2</span>
              Specific Output Desired <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Required by Role Card</span>
          </div>
          <input
            type="text"
            value={desiredOutput}
            onChange={(e) => setDesiredOutput(e.target.value)}
            placeholder="e.g. A concise apology note explaining the sudden illness with an async makeup plan"
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Input 3: Additional Information / Symptoms */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">3</span>
              Symptoms or Reason for Inability to Work <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">Diagnostic input</span>
          </div>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={2}
            placeholder="e.g. High fever (102°F), acute body chills, bedridden, doctor advised resting for 48 hours."
            className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50 resize-none leading-relaxed"
          />
        </div>

        {/* Logistics details (optional context) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Logistics & Deliverable Status (Optional)
          </label>
          <input
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="e.g. Partner has the deck link; will follow up by Thursday morning."
            className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        {/* Tone expression selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Letter Tone Expression
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'respectful', label: 'Respectful & Clean', desc: 'Standard studio etiquette' },
              { id: 'direct', label: 'Direct & Concise', desc: 'Minimal words, high impact' },
              { id: 'expressive', label: 'Expressive & Honest', desc: 'Genuine personal voice' },
              { id: 'formal', label: 'Formal / Medical', desc: 'Tang Center policy compliant' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTone(item.id as any)}
                className={`p-2 rounded-lg border text-left transition ${
                  tone === item.id
                    ? 'border-blue-600 bg-blue-50/60 text-blue-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs flex items-center justify-between">
                  {item.label}
                  {tone === item.id && <Check className="w-3 h-3 text-blue-600" />}
                </div>
                <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">
                  {item.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onSubmitConsult}
        disabled={isLoading || !initialAsk.trim()}
        className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
            <span>Consulting Reliable Peer...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Generate Peer Advice & Apology Letter</span>
          </>
        )}
      </button>
    </div>
  );
};
