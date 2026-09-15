import { RoleCardData, ScenarioPreset } from '../types';

export const RELIABLE_PEER_ROLE_CARD: RoleCardData = {
  roleName: "Reliable Peer",
  purpose: "To help classmates with school-related questions, specifically pertaining to relationships with professors and access to school resources. Informational and not conversational.",
  engagementContext: "The friend (Yuwen) is seeking advice on how to write a letter to Hugh Dubberly about missing class due to serious sickness.",
  behavioralRules: [
    "High-level Informative",
    "Diagnostic while keeping responses short and high-level",
    "Only responds in a single short paragraph",
    "Addresses everyone by their first names in the body",
    "Casual conversational language and tone"
  ],
  interactionLoop: [
    {
      step: 1,
      title: "High-level suggestion",
      description: "Provides high-level suggestion on how to approach the professor and the absence."
    },
    {
      step: 2,
      title: "Ask for symptoms & logistics",
      description: "Diagnoses the specifics, asking about symptoms, duration, or key class commitments."
    },
    {
      step: 3,
      title: "Clarifies suggestion",
      description: "Narrows down the exact message angle based on symptoms and school policy."
    },
    {
      step: 4,
      title: "Provides alternative",
      description: "Offers a viable alternative (e.g., async review, make-up critique, partner coverage)."
    }
  ],
  boundaries: [
    "A respectful peer without pushing for personal details or assuming feelings",
    "Only responds in accordance to school policy"
  ],
  doesNotDo: [
    "Does not overly sympathize",
    "Does not fabricate information",
    "Does not encourage disrespectful conduct",
    "Does not go into high detail",
    "Does not ask follow-up questions, only responds"
  ],
  requiredInputs: [
    "Initial ask",
    "Specific output requested",
    "Additional information / symptoms"
  ],
  outputs: [
    "Organized feedback structure",
    "Responds to user's request in order of how question is phrased"
  ],
  knowledgeBase: [
    "Knowledge of characters: Hugh Dubberly (systems design pioneer, teaches systems/theory in UC Berkeley MDes, appreciates directness, conceptual clarity, and proactive synthesis)",
    "Knowledge of context: UC Berkeley MDes program, Jacobs Hall studio culture, Tang Center health policies and medical excuses, cohort peer dynamics"
  ],
  additionalRules: [
    "Do not start messages addressing by first name",
    "Always gear the first sentence toward an empathy driven reply",
    "Provide logistical solutions after showing empathy",
    "Provide examples with an 'I would...' format to make replies feel more friendly and human",
    "Try to keep responses brief and informative"
  ]
};

export const DEFAULT_SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "yuwen-hugh-serious-sick",
    title: "Yuwen to Hugh Dubberly (Canonical)",
    category: "sickness",
    studentName: "Yuwen",
    professorName: "Hugh",
    course: "DES INV 200: Systems & Cybernetics",
    program: "UC Berkeley MDes",
    initialAsk: "I'm running a 102° fever and have severe flu symptoms. I can't attend today's studio critique session with Hugh. How should I write to him without sound like I'm slacking?",
    desiredOutput: "A concise, respectful absence email explaining the sudden illness with a proactive makeup plan.",
    symptomsOrReason: "High fever (102°F), severe body chills, bedridden, doctor advised resting for 48 hours.",
    logisticsDetails: "Today is a studio review of the mid-semester conceptual mapping deck. Partner is Emma, and deck is already in Google Drive.",
    urgency: "high"
  },
  {
    id: "migraine-critique-missed",
    title: "Severe Migraine Before Studio Review",
    category: "sickness",
    studentName: "Alex",
    professorName: "Kimiko",
    course: "DES INV 202: Design Prototyping",
    program: "UC Berkeley MDes",
    initialAsk: "I woke up with an incapacitating migraine and extreme light sensitivity. I cannot look at screens to attend our interactive demo class. What should I send Kimiko?",
    desiredOutput: "Direct apology note notifying of screen inability and requesting async feedback.",
    symptomsOrReason: "Acute visual migraine, nausea, light sensitivity, prescribed darkness for the next 12 hours.",
    logisticsDetails: "Was supposed to run physical prototype test at Jacobs 210 at 2 PM. Teammate Carlos has the 3D print.",
    urgency: "high"
  },
  {
    id: "tang-center-doctor-visit",
    title: "Emergency Tang Center Clinic Visit",
    category: "emergency",
    studentName: "Maya",
    professorName: "Eric",
    course: "DES INV 215: Designing Emerging Technologies",
    program: "UC Berkeley MDes",
    initialAsk: "I had an acute allergic reaction this morning and am currently waiting at Tang Center urgent care. I'll miss lab seminar. How do I let Eric know quickly?",
    desiredOutput: "Short, high-level urgent notice with Tang Center paperwork mention.",
    symptomsOrReason: "Allergic reaction requiring immediate medical evaluation and monitoring.",
    logisticsDetails: "Tang Center physician note will be uploaded to student portal by tomorrow morning.",
    urgency: "high"
  },
  {
    id: "exhaustion-burnout-deadline",
    title: "Acute Burnout & Inability to Work",
    category: "burnout",
    studentName: "Jordan",
    professorName: "Bjoern",
    course: "DES INV 290: Research & Fabrication Studio",
    program: "UC Berkeley MDes",
    initialAsk: "I've hit severe physical exhaustion and mental burnout after three sleepless nights. I literally cannot concentrate enough to produce safe shop work today. How do I honestly and expressively apologize for missing shop time?",
    desiredOutput: "A mature, expressive note acknowledging personal wellness boundary while offering a catch-up milestone.",
    symptomsOrReason: "Severe physical fatigue, dizziness, cognitive fog making machine shop tool usage unsafe.",
    logisticsDetails: "Jacobs Hall woodshop / laser cutter slot at 10 AM. Willing to reschedule for Thursday morning.",
    urgency: "medium"
  },
  {
    id: "covid-isolation-presentation",
    title: "COVID Isolation & Remote Alternative",
    category: "sickness",
    studentName: "Liam",
    professorName: "Sara",
    course: "DES INV 204: Technology & Design Strategy",
    program: "UC Berkeley MDes",
    initialAsk: "I just tested positive for COVID on a rapid test. I feel sick and have to isolate in accordance with UC Berkeley campus guidelines. How do I tell Sara and coordinate my presentation slide?",
    desiredOutput: "Policy-compliant absence notice offering remote Zoom check-in or async recorded video.",
    symptomsOrReason: "Positive COVID-19 rapid test, mild cough, fatigue, mandated 5-day isolation.",
    logisticsDetails: "Group presentation is tomorrow at 11 AM. Pre-recorded audio clip can be sent to group.",
    urgency: "medium"
  }
];
