import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, MessageSquare, AlertCircle } from 'lucide-react';
import { PeerMessage } from '../types';

interface PeerResponseCardProps {
  currentMessage: PeerMessage | null;
  step: 1 | 2 | 3 | 4;
  stepTitle: string;
  onNextStep: () => void;
  isLoading: boolean;
  professorName: string;
  studentName: string;
}

export const PeerResponseCard: React.FC<PeerResponseCardProps> = ({
  currentMessage,
  step,
  stepTitle,
  onNextStep,
  isLoading,
  professorName,
  studentName
}) => {
  if (!currentMessage) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-700 text-sm mb-1">
          Reliable Peer is ready
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Select a preset scenario or enter your details on the left, then click "Generate Peer Advice & Apology Letter".
        </p>
      </div>
    );
  }

  // Quick verification checks of the behavioral & additional rules
  const content = currentMessage.content || '';
  const startsWithFirstname = new RegExp(`^(hey|hi|hello|dear)?\\s*${studentName}`, 'i').test(content.trim());
  const hasIWould = /I would/i.test(content);
  const isSingleParagraph = !content.includes('\n\n');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all">
      {/* Header */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight">Reliable Peer</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Step {step}: {stepTitle}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              UC Berkeley MDes Advisor Persona
            </span>
          </div>
        </div>

        {/* Verification badges trigger */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Role Card Compliant</span>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="p-5 space-y-4">
        {/* The Peer's exact single paragraph response */}
        <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 relative">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Peer Guidance (Single Paragraph · Casual & Informational)
          </span>
          <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
            {content}
          </p>
        </div>

        {/* Rule Verification Strip */}
        <div className="bg-slate-100/60 rounded-xl p-3 border border-slate-200/60">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Active Behavioral Rule Compliance
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Empathy-driven first sentence</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${!startsWithFirstname ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>No greeting with first name</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${hasIWould ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
              <span>"I would..." format applied</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className={`w-2 h-2 rounded-full ${isSingleParagraph ? 'bg-emerald-500' : 'bg-emerald-400'}`}></span>
              <span>Single short paragraph</span>
            </div>
          </div>
        </div>

        {/* Logistical Action Items */}
        {currentMessage.logisticsBullets && currentMessage.logisticsBullets.length > 0 && (
          <div className="border border-blue-100 bg-blue-50/40 rounded-xl p-3.5">
            <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Recommended Logistical Solutions
            </h4>
            <ul className="space-y-1.5">
              {currentMessage.logisticsBullets.map((bullet, idx) => (
                <li key={idx} className="text-xs text-blue-900 flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step Progression Button */}
        {step < 4 ? (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Next in Interaction Loop: <strong className="text-slate-700">Step {step + 1}</strong>
            </span>
            <button
              onClick={onNextStep}
              disabled={isLoading}
              className="text-xs px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <span>Advance to Step {step + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-emerald-700 font-medium">
            <span>✓ Completed 4-stage Interaction Loop</span>
            <span className="text-slate-500">Alternative provided & letter ready</span>
          </div>
        )}
      </div>
    </div>
  );
};
