export interface RoleCardData {
  roleName: string;
  purpose: string;
  engagementContext: string;
  behavioralRules: string[];
  interactionLoop: {
    step: number;
    title: string;
    description: string;
  }[];
  boundaries: string[];
  doesNotDo: string[];
  requiredInputs: string[];
  outputs: string[];
  knowledgeBase: string[];
  additionalRules: string[];
}

export interface ScenarioPreset {
  id: string;
  title: string;
  category: 'sickness' | 'emergency' | 'burnout' | 'deadline' | 'critique';
  studentName: string;
  professorName: string;
  course: string;
  program: string;
  initialAsk: string;
  desiredOutput: string;
  symptomsOrReason: string;
  logisticsDetails: string;
  urgency: 'high' | 'medium' | 'low';
}

export interface PeerMessage {
  id: string;
  role: 'user' | 'peer';
  content: string;
  timestamp: string;
  stepNumber?: 1 | 2 | 3 | 4;
  stepName?: string;
  logisticsBullets?: string[];
  suggestedLetterSnippet?: string;
}

export interface GeneratedLetter {
  id: string;
  subject: string;
  salutation: string;
  recipientName: string;
  senderName: string;
  course: string;
  body: string;
  makeUpPlan: string;
  signoff: string;
  fullDraft: string;
  tone: 'direct' | 'respectful' | 'expressive' | 'formal';
  policyChecklist: string[];
  createdAt: string;
}

export interface PeerConsultRequest {
  step: 1 | 2 | 3 | 4;
  studentName: string;
  professorName: string;
  course: string;
  initialAsk: string;
  desiredOutput: string;
  additionalInfo: string;
  symptoms: string;
  previousMessages?: { role: 'user' | 'peer'; content: string }[];
}

export interface PeerConsultResponse {
  peerReply: string;
  step: 1 | 2 | 3 | 4;
  stepTitle: string;
  logisticsBullets: string[];
  letterDraft?: GeneratedLetter;
}
