import React from 'react';
import { Check, ArrowRight, Lightbulb, Stethoscope, SearchCheck, RefreshCcw } from 'lucide-react';

interface InteractionLoopStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  onSelectStep: (step: 1 | 2 | 3 | 4) => void;
  isLoading?: boolean;
}

const STEP_DETAILS = [
  {
    step: 1 as const,
    label: "1. Suggestion",
    sublabel: "High-level guidance",
    icon: Lightbulb
  },
  {
    step: 2 as const,
    label: "2. Symptoms",
    sublabel: "Diagnostic check",
    icon: Stethoscope
  },
  {
    step: 3 as const,
    label: "3. Clarify",
    sublabel: "Sharpen message",
    icon: SearchCheck
  },
  {
    step: 4 as const,
    label: "4. Alternative",
    sublabel: "Async / make-up",
    icon: RefreshCcw
  }
];

export const InteractionLoopStepper: React.FC<InteractionLoopStepperProps> = ({
  currentStep,
  onSelectStep,
  isLoading = false
}) => {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Agentic Interaction Loop
        </span>
        <span className="text-xs text-slate-500 font-medium">
          Step {currentStep} of 4
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {STEP_DETAILS.map(({ step, label, sublabel, icon: Icon }) => {
          const isActive = currentStep === step;
          const isCompleted = currentStep > step;

          return (
            <button
              key={step}
              onClick={() => onSelectStep(step)}
              disabled={isLoading}
              className={`p-2.5 rounded-lg border text-left transition relative flex flex-col justify-between ${
                isActive
                  ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs'
                  : isCompleted
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  : 'bg-white border-slate-200/80 text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : step}
                </div>
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-300'
                  }`}
                />
              </div>

              <div>
                <div className="text-xs font-bold leading-tight">
                  {label}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {sublabel}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
