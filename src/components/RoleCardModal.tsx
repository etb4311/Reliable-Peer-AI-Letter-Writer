import React from 'react';
import { X, ShieldCheck, UserCheck, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react';
import { RELIABLE_PEER_ROLE_CARD } from '../data/roleCard';

interface RoleCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleCardModal: React.FC<RoleCardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
              RP
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {RELIABLE_PEER_ROLE_CARD.roleName} — Personality & Rule Specification
              </h2>
              <p className="text-xs text-slate-400">
                Agentic Role Card Δ UC Berkeley MDes Engagement Context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-750">
          {/* Purpose & Engagement Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Purpose
              </span>
              <p className="text-slate-800 leading-relaxed">
                {RELIABLE_PEER_ROLE_CARD.purpose}
              </p>
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Engagement Context
              </span>
              <p className="text-slate-800 leading-relaxed">
                {RELIABLE_PEER_ROLE_CARD.engagementContext}
              </p>
            </div>
          </div>

          {/* Interaction Loop */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Interaction Loop (4 Stages)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RELIABLE_PEER_ROLE_CARD.interactionLoop.map((loop) => (
                <div key={loop.step} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs mb-1">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                      {loop.step}
                    </span>
                    {loop.title}
                  </div>
                  <p className="text-xs text-slate-600 leading-normal pl-7">
                    {loop.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral Rules vs Boundaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Behavioral Rules Δ
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {RELIABLE_PEER_ROLE_CARD.behavioralRules.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
              <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Boundaries & Does Not Do
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950">
                {RELIABLE_PEER_ROLE_CARD.doesNotDo.map((d, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Rules Δ Mandates */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              Additional Rules (Strict Directives)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-blue-950">
              {RELIABLE_PEER_ROLE_CARD.additionalRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-lg border border-blue-100">
                  <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Knowledge Base */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xs uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-slate-700" />
              Knowledge Base
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              {RELIABLE_PEER_ROLE_CARD.knowledgeBase.map((item, idx) => (
                <li key={idx} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Close Specification
          </button>
        </div>
      </div>
    </div>
  );
};
