export type SubjectType = 'toan' | 'tieng-viet';

export type ChildProficiency = 'moi-lam-quen' | 'can-luyen-them' | 'da-kha-vung';

export interface PracticeQuestion {
  id: string;
  question: string;
  hint: string;
  parentAnswer: string;
}

export interface MathTopic {
  id: string;
  order: number;
  title: string;
  category: string;
  target: string;
  parentGuide: string;
  simpleExample: string;
  activities: string[];
  game: {
    name: string;
    description: string;
    materials: string;
  };
  questions: PracticeQuestion[];
  commonMistakes: string;
  howToHelp: string;
  fiveMinPlan: string;
  tenMinPlan: string;
}

export interface VietnameseTopic {
  id: string;
  order: number;
  title: string;
  category: string;
  target: string;
  textbookAlignment?: string;
  parentGuide: string;
  pronunciationNotes: string;
  flashcardWords: string[];
  openQuestions: string[];
  quickGame: {
    name: string;
    howToPlay: string;
  };
  sampleSentences: string[];
  slowReaderAdvice: string;
  thingsToAvoid: string;
}

export interface ParentTip {
  id: string;
  order: number;
  title: string;
  shortDesc: string;
  example: string;
  parentScript: string;
  applyImmediately: string;
  category: 'thoi-gian' | 'tam-ly' | 'phuong-phap' | 'cong-nhan';
}

export interface PhysicalGame {
  id: string;
  order: number;
  title: string;
  subject: SubjectType;
  target: string;
  materials: string[];
  rules: string[];
  parentInstructions: string;
  howToFinish: string;
  adjustDifficulty: {
    easier: string;
    harder: string;
  };
}

export interface FAQEntry {
  id: string;
  question: string;
  subject: SubjectType | 'chung';
  shortAnswer: string;
  detailedSteps: string[];
  verifiedByTeacher: boolean;
  teacherNotes?: string;
  topicRef?: string;
}

export interface SessionPlan {
  title: string;
  duration: number;
  target: string;
  materials: string[];
  timeline: {
    time: string;
    title: string;
    detail: string;
  }[];
  parentScript: string;
  tip: string;
  isSimulated?: boolean;
}

export interface ProgressRecord {
  id: string;
  date: string;
  subject: SubjectType;
  topicTitle: string;
  durationMinutes: number;
  status: 'doc-lap' | 'co-ho-tro' | 'can-luyen-them';
  parentNote?: string;
  childNickname?: string;
}

export interface SurveyResponse {
  id: string;
  type: 'pre' | 'post';
  date: string;
  participantCode: string;
  answers: Record<string, any>;
}

export interface ShiftScheduleRecommendation {
  shift: 'day' | 'evening' | 'night' | 'rotating' | 'unspecified';
  name: string;
  timeWindow: string;
  recommendation: string;
  routine: {
    time: string;
    activity: string;
    duration: string;
  }[];
}
