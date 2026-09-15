import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return ai;
}

// Fallback generator in case of missing API key or offline execution
function generateRuleCompliantFallback(data: {
  step: 1 | 2 | 3 | 4;
  studentName: string;
  professorName: string;
  course: string;
  initialAsk: string;
  desiredOutput: string;
  additionalInfo: string;
  symptoms: string;
}) {
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
      tone: 'respectful' as const,
      policyChecklist: [
        'Adheres to UC Berkeley attendance & medical absence guidelines',
        'Includes explicit makeup plan and timeline',
        'Transparent team coordination without shifting burden onto instructor'
      ],
      createdAt: new Date().toISOString()
    }
  };
}

// Peer Consult Endpoint
app.post('/api/peer-consult', async (req: Request, res: Response) => {
  try {
    const {
      step = 1,
      studentName = 'Yuwen',
      professorName = 'Hugh',
      course = 'DES INV 200: Systems & Cybernetics',
      initialAsk = "I'm sick and need to miss Hugh's class today.",
      desiredOutput = 'A formal absence notice and makeup plan',
      additionalInfo = '',
      symptoms = 'high fever and severe flu',
      previousMessages = []
    } = req.body;

    const client = getGeminiClient();

    if (!client) {
      // Fallback mode if no API key configured
      const fallbackResult = generateRuleCompliantFallback({
        step,
        studentName,
        professorName,
        course,
        initialAsk,
        desiredOutput,
        additionalInfo,
        symptoms
      });
      return res.json(fallbackResult);
    }

    const systemInstruction = `
You are the "Reliable Peer" role card assistant for students (specifically in the UC Berkeley MDes program, though applicable generally).

ROLE CARD SPECIFICATIONS:
- Role Name: Reliable Peer
- Purpose: To help classmates with school-related questions, specifically pertaining to relationships with professors and access to school resources. Informational and not conversational.
- Engagement Context: The friend (${studentName}) is seeking advice on how to write a letter to ${professorName} about missing class (${course}) due to sickness or inability to work.
- Knowledge Base:
  * Characters: ${professorName} (e.g. Hugh Dubberly, systems design thinker, appreciates clarity, conceptual rigor, synthesis, concise honesty, respectful accountability).
  * Context: UC Berkeley MDes, Jacobs Hall studio culture, Tang Center health guidelines (medical notes, excused absences), collaborative cohort expectations.

BEHAVIORAL RULES:
- High-level Informative.
- Diagnostic while keeping responses short and high-level.
- ONLY responds in a single short paragraph.
- Addresses everyone by their first names in the body of the paragraph (e.g., "${professorName}", "${studentName}").
- Casual conversational language and tone.

INTERACTION LOOP STEP (Current Step: ${step}):
1. Provides high-level suggestion.
2. Ask for symptoms / acknowledge symptoms & logistics.
3. Clarifies suggestion.
4. Provides alternative.

BOUNDARIES:
- A respectful peer without pushing for personal details or assuming feelings.
- Only responds in accordance to school policy.

DOES NOT DO:
- Does not overly sympathize.
- Does not fabricate information.
- Does not encourage disrespectful conduct.
- Does not go into high detail.
- Does not ask follow-up questions, only responds.

MANDATORY ADDITIONAL RULES:
1. DO NOT start messages addressing by first name (e.g. NEVER start with "${studentName}," or "Hey ${studentName}").
2. ALWAYS gear the FIRST sentence toward an empathy driven reply (e.g. "I'm so sorry you're dealing with that, it really sucks to get hit with sickness mid-semester.").
3. Provide logistical solutions immediately after showing empathy.
4. Provide examples with an "I would..." format to make replies feel more friendly and human (e.g. "I would send ${professorName} a quick email before studio...").
5. Try to keep responses brief and informative (strictly one short paragraph!).

REQUIRED OUTPUTS:
You must return JSON matching the schema with:
- peerReply: The single short paragraph conforming to ALL behavioral and additional rules above.
- stepTitle: Name of the current step in the interaction loop.
- logisticsBullets: Exactly 3 short, actionable logistical bullets for the student.
- letterDraft: An apology / absence letter formatted with subject, salutation, body, makeUpPlan, signoff, fullDraft, tone, policyChecklist.
`;

    const userPrompt = `
User Context:
- Student Name: ${studentName}
- Professor / Recipient: ${professorName}
- Course: ${course}
- Current Interaction Step: ${step}
- Initial Ask: ${initialAsk}
- Desired Output: ${desiredOutput}
- Symptoms / Inability Reason: ${symptoms}
- Additional Info / Context: ${additionalInfo}
- Previous Dialogue History: ${JSON.stringify(previousMessages)}

Generate the peer response for Step ${step} along with the practical logistical bullets and the formatted apology/absence letter draft.
`;

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            peerReply: {
              type: Type.STRING,
              description: 'Single short paragraph. Must NOT start with a first name greeting. First sentence MUST be empathy-driven. Must include "I would..." logistical suggestion. Casual peer tone.'
            },
            stepTitle: {
              type: Type.STRING,
              description: 'The name of the interaction loop step (e.g. High-level suggestion, Ask for symptoms, Clarifies suggestion, Provides alternative)'
            },
            logisticsBullets: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 concise logistical action points for the student.'
            },
            letterDraft: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                salutation: { type: Type.STRING },
                recipientName: { type: Type.STRING },
                senderName: { type: Type.STRING },
                course: { type: Type.STRING },
                body: { type: Type.STRING },
                makeUpPlan: { type: Type.STRING },
                signoff: { type: Type.STRING },
                fullDraft: { type: Type.STRING },
                tone: { type: Type.STRING },
                policyChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['subject', 'salutation', 'recipientName', 'senderName', 'course', 'body', 'makeUpPlan', 'signoff', 'fullDraft', 'policyChecklist']
            }
          },
          required: ['peerReply', 'stepTitle', 'logisticsBullets', 'letterDraft']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      peerReply: parsed.peerReply,
      step,
      stepTitle: parsed.stepTitle || `Step ${step}`,
      logisticsBullets: parsed.logisticsBullets || [],
      letterDraft: {
        ...parsed.letterDraft,
        id: `letter-${Date.now()}`,
        createdAt: new Date().toISOString()
      }
    });
  } catch (error: any) {
    console.error('Error in /api/peer-consult:', error);
    // Graceful fallback if Gemini API throws (e.g. rate limit, auth)
    const fallback = generateRuleCompliantFallback(req.body);
    return res.json(fallback);
  }
});

// Direct Letter Re-generation or Modification Endpoint
app.post('/api/generate-letter', async (req: Request, res: Response) => {
  try {
    const {
      studentName = 'Yuwen',
      professorName = 'Hugh',
      course = 'DES INV 200: Systems & Cybernetics',
      symptoms = 'severe flu',
      tone = 'respectful',
      specificRequest = 'A standard absence notice with async makeup plan'
    } = req.body;

    const client = getGeminiClient();

    if (!client) {
      const fallback = generateRuleCompliantFallback({
        step: 1,
        studentName,
        professorName,
        course,
        initialAsk: specificRequest,
        desiredOutput: tone,
        additionalInfo: '',
        symptoms
      });
      return res.json(fallback.letterDraft);
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Draft an apology / absence letter from student ${studentName} to instructor ${professorName} for ${course}.
Reason: ${symptoms}.
Requested tone: ${tone}.
Specific Request: ${specificRequest}.
Context: UC Berkeley MDes, systems & studio work, respectful peer advocacy.
Produce clean JSON with subject, salutation, recipientName, senderName, course, body, makeUpPlan, signoff, fullDraft, policyChecklist.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            salutation: { type: Type.STRING },
            recipientName: { type: Type.STRING },
            senderName: { type: Type.STRING },
            course: { type: Type.STRING },
            body: { type: Type.STRING },
            makeUpPlan: { type: Type.STRING },
            signoff: { type: Type.STRING },
            fullDraft: { type: Type.STRING },
            tone: { type: Type.STRING },
            policyChecklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['subject', 'salutation', 'recipientName', 'senderName', 'course', 'body', 'makeUpPlan', 'signoff', 'fullDraft', 'policyChecklist']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...parsed,
      id: `letter-${Date.now()}`,
      createdAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error generating letter:', err);
    res.status(500).json({ error: 'Failed to generate letter' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', role: 'Reliable Peer', model: 'gemini-3.8-flash' });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Reliable Peer Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
