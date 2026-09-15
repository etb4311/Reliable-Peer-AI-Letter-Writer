import React, { useState } from 'react';
import { Copy, Check, Mail, Edit3, Download, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { GeneratedLetter } from '../types';

interface LetterViewerProps {
  letter: GeneratedLetter | null;
  onModifyLetter: (instruction: string) => void;
  isLoadingModification?: boolean;
}

export const LetterViewer: React.FC<LetterViewerProps> = ({
  letter,
  onModifyLetter,
  isLoadingModification = false
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDraft, setEditedDraft] = useState('');

  // Synchronize draft when letter changes
  React.useEffect(() => {
    if (letter) {
      setEditedDraft(letter.fullDraft);
      setIsEditing(false);
    }
  }, [letter]);

  if (!letter) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <Edit3 className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-slate-700 text-sm mb-1">
          No letter generated yet
        </h3>
        <p className="text-xs text-slate-500 max-w-sm">
          Once the Reliable Peer analyzes your situation, your tailored absence & apology letter will appear here.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedDraft || letter.fullDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenEmail = () => {
    const subject = encodeURIComponent(letter.subject);
    const body = encodeURIComponent(editedDraft || letter.fullDraft);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([editedDraft || letter.fullDraft], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${letter.subject.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Action Header */}
      <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            Generated Apology & Absence Letter
          </h3>
          <span className="text-[11px] text-slate-400">
            Recipient: {letter.recipientName} · Course: {letter.course}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1 cursor-pointer ${
              isEditing
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Done Editing' : 'Edit Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenEmail}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Open in Mail</span>
          </button>
        </div>
      </div>

      {/* Letter Meta */}
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">Subject:</span>
          <span className="font-medium text-slate-900 select-all bg-white px-2 py-1 rounded border border-slate-200/70 flex-1">
            {letter.subject}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">To:</span>
          <span className="text-slate-700">{letter.recipientName} ({letter.course})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500 w-16">From:</span>
          <span className="text-slate-700">{letter.senderName} (UC Berkeley MDes)</span>
        </div>
      </div>

      {/* Letter Paper Body */}
      <div className="p-6 bg-amber-50/15">
        {isEditing ? (
          <textarea
            value={editedDraft}
            onChange={(e) => setEditedDraft(e.target.value)}
            rows={12}
            className="w-full text-xs sm:text-sm font-editorial leading-relaxed text-slate-900 p-4 bg-white border border-blue-400 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 shadow-inner"
          />
        ) : (
          <div className="font-editorial text-xs sm:text-sm leading-relaxed text-slate-800 whitespace-pre-line bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
            {editedDraft || letter.fullDraft}
          </div>
        )}
      </div>

      {/* Quick Polish / Tweak Pills */}
      <div className="p-4 bg-slate-50 border-t border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" />
            Quick One-Click Adjustments
          </span>
          <button
            type="button"
            onClick={handleDownload}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition cursor-pointer"
          >
            <Download className="w-3 h-3" />
            <span>Download .txt</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { label: 'Make more concise', prompt: 'Condense into 3 tight sentences while keeping makeup plan' },
            { label: 'Add Google Drive link mention', prompt: 'Add a line noting project files are in Google Drive folder' },
            { label: 'Mention Tang Center note', prompt: 'Include a sentence offering official doctor excuse note from Tang Center upon request' },
            { label: 'Partner slide handover', prompt: 'Explicitly specify that project partner is prepared to present shared slides' },
            { label: 'Request brief 10m office hours', prompt: 'Add a sentence requesting a quick 10-minute check-in during next office hours' }
          ].map((action, i) => (
            <button
              key={i}
              type="button"
              disabled={isLoadingModification}
              onClick={() => onModifyLetter(action.prompt)}
              className="text-xs px-2.5 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-900 rounded-lg transition shadow-2xs cursor-pointer disabled:opacity-50"
            >
              + {action.label}
            </button>
          ))}
        </div>

        {/* Policy & Etiquette Checklist */}
        {letter.policyChecklist && letter.policyChecklist.length > 0 && (
          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Policy & Studio Etiquette Check
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {letter.policyChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
