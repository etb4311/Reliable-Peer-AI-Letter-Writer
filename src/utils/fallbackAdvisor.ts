import { GeneratedLetter, PeerConsultResponse } from '../types';

export function generateRuleCompliantFallback(data: {
  step: 1 | 2 | 3 | 4;
  studentName: string;
  professorName: string;
  course: string;
  initialAsk: string;
  desiredOutput: string;
  additionalInfo: string;
  symptoms: string;
  tone?: 'direct' | 'respectful' | 'expressive' | 'formal';
}): PeerConsultResponse {
  const sName = data.studentName || 'Student';
  const pName = data.professorName || 'Professor';
  const course = data.course || 'Studio Class';
  const symptoms = data.symptoms || data.additionalInfo || 'sudden illness';

  let peerReply = '';
  let stepTitle = '';
  let logisticsBullets: string[] = [];

  switch (data.step) {
    case 1:
      stepTitle = 'High-level suggestion';
      peerReply = `It is awful feeling so drained and sick right when you have class commitments. I would send ${pName} a concise, respectful note right away explaining that you're unwell and won't be able to safely attend ${course}, while reassuring them that your materials are uploaded and you're coordinating with your team so studio progress doesn't stall.`;
      logisticsBullets = [
        `Send notice to ${pName} at least 1 hour prior to studio time.`,
        `Ping your team or studio cohort on Slack with your progress status.`,
        `Log your absence in accordance with Berkeley MDes studio attendance guidelines.`
      ];
      break;
    case 2:
      stepTitle = 'Ask for symptoms & logistics';
      peerReply = `It really sucks being sidelined by illness, especially with how intensive the semester is right now. I would mention your core symptoms like ${symptoms} just enough so ${pName} understands you need complete rest, while checking if you need an official Tang Center verification note if you'll be out for more than forty-eight hours.`;
      logisticsBullets = [
        `State symptoms concisely without over-sharing personal medical details.`,
        `Check Tang Center (University Health Services) online portal for appointment records.`,
        `Confirm whether an excused absence waiver is needed for extended absence.`
      ];
      break;
    case 3:
      stepTitle = 'Clarifies suggestion';
      peerReply = `Dealing with a severe physical setback is frustrating, so keeping your message clear and low-friction is your best move. I would frame your email around your return timeline, letting ${pName} know you're resting today under doctor advice and will follow up with your updated project synthesis by Thursday once your fever breaks.`;
      logisticsBullets = [
        `Specify a realistic date for when you expect to follow up.`,
        `Attach or link your current work in Google Drive or Figma for async viewing.`,
        `Keep ${pName}'s workload minimal by making clear no immediate action is required on their end.`
      ];
      break;
    case 4:
    default:
      stepTitle = 'Provides alternative';
      peerReply = `I know how stressful it is to miss crucial in-person critique, but your health genuinely comes first. I would offer an asynchronous alternative, such as recording a short Loom video walk-through or having your partner present your conceptual mapping slides so you can still receive peer critique without jeopardizing your recovery.`;
      logisticsBullets = [
        `Offer an async walkthrough (Loom or annotated PDF deck).`,
        `Authorize a project teammate to present shared slides on your behalf.`,
        `Schedule a brief 10-minute touchpoint during office hours after recovery.`
      ];
      break;
  }

  const subject = `Absence Notice & Project Update: ${course} - ${sName}`;
  const salutation = `Dear ${pName},`;
  const body = `I am writing to let you know that I am unable to attend today's session for ${course} due to ${symptoms}. I am currently resting and following medical guidance to recover as quickly as possible.\n\nTo ensure our team and studio momentum remain uninterrupted, I have shared our latest milestone deck and briefed my collaborators.`;
  const makeUpPlan = `I plan to review the session notes asynchronously and will follow up with you on Thursday once I am back on my feet to ensure all deliverables are fully aligned.`;
  const signoff = `Best regards,\n${sName}\nUC Berkeley MDes`;

  const fullDraft = `${subject}\n\n${salutation}\n\n${body}\n\n${makeUpPlan}\n\n${signoff}`;

  return {
    peerReply,
    step: data.step,
    stepTitle,
    logisticsBullets,
    letterDraft: {
      id: `letter-${Date.now()}`,
      subject,
      salutation,
      recipientName: pName,
      senderName: sName,
      course,
      body,
      makeUpPlan,
      signoff,
      fullDraft,
      tone: data.tone || 'respectful',
      policyChecklist: [
        'Adheres to UC Berkeley attendance & medical absence guidelines',
        'Includes explicit makeup plan and timeline',
        'Transparent team coordination without shifting burden onto instructor'
      ],
      createdAt: new Date().toISOString()
    }
  };
}
