import React, { useState, useEffect } from 'react';
import { BookOpen, ShieldCheck, RefreshCw, Sparkles, MessageSquare, Info } from 'lucide-react';
import { RoleCardModal } from './components/RoleCardModal';
import { InteractionLoopStepper } from './components/InteractionLoopStepper';
import { InputPanel } from './components/InputPanel';
import { PeerResponseCard } from './components/PeerResponseCard';
import { LetterViewer } from './components/LetterViewer';
import { ScenarioPreset, PeerMessage, GeneratedLetter, PeerConsultResponse } from './types';
import { DEFAULT_SCENARIO_PRESETS, RELIABLE_PEER_ROLE_CARD } from './data/roleCard';
import { generateRuleCompliantFallback } from './utils/fallbackAdvisor';

export default function App() {
  const defaultPreset = DEFAULT_SCENARIO_PRESETS[0];

  const [studentName, setStudentName] = useState(defaultPreset.studentName);
  const [professorName, setProfessorName] = useState(defaultPreset.professorName);
  const [course, setCourse] = useState(defaultPreset.course);
  const [initialAsk, setInitialAsk] = useState(defaultPreset.initialAsk);
  const [desiredOutput, setDesiredOutput] = useState(defaultPreset.desiredOutput);
  const [symptoms, setSymptoms] = useState(defaultPreset.symptomsOrReason);
  const [additionalInfo, setAdditionalInfo] = useState(defaultPreset.logisticsDetails);
  const [tone, setTone] = useState<'direct' | 'respectful' | 'expressive' | 'formal'>('respectful');

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [stepTitle, setStepTitle] = useState('High-level suggestion');
  const [peerMessage, setPeerMessage] = useState<PeerMessage | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMod, setIsLoadingMod] = useState(false);
  const [isRoleCardOpen, setIsRoleCardOpen] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Trigger consultation with Reliable Peer
  const handleConsult = async (targetStep?: 1 | 2 | 3 | 4) => {
    const stepToRun = targetStep || currentStep;
    setIsLoading(true);
    setStatusNotification(null);

    try {
      const response = await fetch('/api/peer-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step: stepToRun,
          studentName,
          professorName,
          course,
          initialAsk,
          desiredOutput,
          additionalInfo,
          symptoms,
          tone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: PeerConsultResponse = await response.json();

      setCurrentStep(data.step);
      setStepTitle(data.stepTitle);
      setPeerMessage({
        id: `msg-${Date.now()}`,
        role: 'peer',
        content: data.peerReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stepNumber: data.step,
        stepName: data.stepTitle,
        logisticsBullets: data.logisticsBullets
      });

      if (data.letterDraft) {
        setGeneratedLetter(data.letterDraft);
      }
    } catch (err: any) {
      console.warn('Backend API unavailable, using local Reliable Peer advisor fallback:', err);
      const fallbackData = generateRuleCompliantFallback({
        step: stepToRun,
        studentName,
        professorName,
        course,
        initialAsk,
        desiredOutput,
        additionalInfo,
        symptoms,
        tone
      });
      setCurrentStep(fallbackData.step);
      setStepTitle(fallbackData.stepTitle);
      setPeerMessage({
        id: `msg-${Date.now()}`,
        role: 'peer',
        content: fallbackData.peerReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stepNumber: fallbackData.step,
        stepName: fallbackData.stepTitle,
        logisticsBullets: fallbackData.logisticsBullets
      });
      if (fallbackData.letterDraft) {
        setGeneratedLetter(fallbackData.letterDraft);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial consultation on first render so user sees live output instantly
  useEffect(() => {
    handleConsult(1);
  }, []);

  // Handle Preset Selection
  const handleApplyPreset = (preset: ScenarioPreset) => {
    setStudentName(preset.studentName);
    setProfessorName(preset.professorName);
    setCourse(preset.course);
    setInitialAsk(preset.initialAsk);
    setDesiredOutput(preset.desiredOutput);
    setSymptoms(preset.symptomsOrReason);
    setAdditionalInfo(preset.logisticsDetails);
    setCurrentStep(1);

    // Auto trigger for immediate feedback
    setTimeout(() => {
      handleConsult(1);
    }, 50);
  };

  // Step advancement in the 4-stage interaction loop
  const handleNextStep = () => {
    if (currentStep < 4) {
      const next = (currentStep + 1) as 1 | 2 | 3 | 4;
      setCurrentStep(next);
      handleConsult(next);
    }
  };

  // Step selection from stepper
  const handleSelectStep = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    handleConsult(step);
  };

  // Quick letter tweak / modification
  const handleModifyLetter = async (instruction: string) => {
    setIsLoadingMod(true);
    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          professorName,
          course,
          symptoms,
          tone,
          specificRequest: `${instruction}. Current letter context: ${generatedLetter?.fullDraft || ''}`
        })
      });

      if (!res.ok) throw new Error('Failed to modify letter');
      const updatedLetter: GeneratedLetter = await res.json();
      setGeneratedLetter(updatedLetter);
    } catch (err) {
      console.error('Error modifying letter:', err);
      // Client-side quick adjustment fallback
      if (generatedLetter) {
        setGeneratedLetter({
          ...generatedLetter,
          fullDraft: `${generatedLetter.fullDraft}\n\n[Note: ${instruction}]`
        });
      }
    } finally {
      setIsLoadingMod(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              RP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                  Reliable Peer
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                  UC Berkeley MDes
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Student Absence & Apology Letter Assistant · Hugh Dubberly Context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsRoleCardOpen(true)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Inspect</span> Role Card & Rules
            </button>

            <button
              onClick={() => handleApplyPreset(DEFAULT_SCENARIO_PRESETS[0])}
              title="Reset to Yuwen & Hugh Dubberly scenario"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {statusNotification && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{statusNotification}</span>
          </div>
        )}

        {/* Interaction Loop Stepper */}
        <InteractionLoopStepper
          currentStep={currentStep}
          onSelectStep={handleSelectStep}
          isLoading={isLoading}
        />

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Student Inputs & Context (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <InputPanel
              studentName={studentName}
              setStudentName={setStudentName}
              professorName={professorName}
              setProfessorName={setProfessorName}
              course={course}
              setCourse={setCourse}
              initialAsk={initialAsk}
              setInitialAsk={setInitialAsk}
              desiredOutput={desiredOutput}
              setDesiredOutput={setDesiredOutput}
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              tone={tone}
              setTone={setTone}
              onApplyPreset={handleApplyPreset}
              onSubmitConsult={() => handleConsult()}
              isLoading={isLoading}
            />

            {/* Role Card Behavior Mini-Guide */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Peer Behavioral Guardrails Active
              </span>
              <ul className="space-y-1.5 text-slate-600 text-[11px]">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>First sentence is always empathy-driven without greeting with first name.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Logistical solutions provided with an "I would..." formulation.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Strictly a single short paragraph, casual tone, informational only.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>No follow-up questions, strictly respectful of UC Berkeley school policies.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Reliable Peer Guidance & Generated Letter (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Reliable Peer Response Card */}
            <PeerResponseCard
              currentMessage={peerMessage}
              step={currentStep}
              stepTitle={stepTitle}
              onNextStep={handleNextStep}
              isLoading={isLoading}
              professorName={professorName}
              studentName={studentName}
            />

            {/* 2. Generated Apology & Absence Letter Viewer */}
            <LetterViewer
              letter={generatedLetter}
              onModifyLetter={handleModifyLetter}
              isLoadingModification={isLoadingMod}
            />
          </div>
        </div>
      </main>

      {/* Role Card & Rules Specification Modal */}
      <RoleCardModal
        isOpen={isRoleCardOpen}
        onClose={() => setIsRoleCardOpen(false)}
      />
    </div>
  );
}
