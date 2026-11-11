export type PriorityType = 'must' | 'exclude' | 'plus';
export type MatchStatusType = 'met' | 'not_met' | 'unknown' | 'conflict';
export type IntentType = 'interested' | 'asking' | 'hesitant' | 'rejecting' | 'sent_resume' | 'other';
export type NextActionType = 'continue' | 'request_resume' | 'end' | 'handoff';

export interface Criterion {
  id: string;
  priority: PriorityType;
  description: string;
  field: string;
}

export interface ComplianceAudit {
  has_discriminatory_terms: boolean;
  intercepted_terms: string[];
  action_note: string;
}

export interface FaqExtract {
  salary_range?: string;
  work_location?: string;
  benefits?: string;
  work_hours?: string;
  interview_process?: string;
  [key: string]: string | undefined;
}

export interface JobParsed {
  criteria: Criterion[];
  compliance_audit?: ComplianceAudit;
  faq_extract: FaqExtract;
}

export interface ScreenCriterionResult {
  id: string;
  priority: PriorityType;
  status: MatchStatusType;
  evidence: string | null;
  note: string;
}

export interface ScreenResult {
  stage: string;
  criteria: ScreenCriterionResult[];
  highlights: string[];
  to_confirm: string[];
  level: 'A' | 'B' | 'C';
  summary: string;
}

export interface ExtractedInfo {
  willing: boolean | null;
  start_date: string | null;
  salary_expect: string | null;
  contact_info: string | null;
}

export interface ChatTurnAnalysis {
  intent: IntentType;
  extracted: ExtractedInfo;
  reply: string;
  next_action: NextActionType;
  handoff_reason: string | null;
}

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'candidate' | 'system';
  text: string;
  timestamp: string;
  analysis?: ChatTurnAnalysis;
}

export interface DeliverySummary {
  recommend_reason: string;
  confirmed_items: Record<string, string>;
  candidate_attitude: '积极' | '正常' | '谨慎';
  potential_risks: string;
  hr_one_liner: string;
}

export interface CandidatePreset {
  id: string;
  name: string;
  title: string;
  experience: string;
  profile: string;
  tags: string[];
  expectedLevel: 'A' | 'B' | 'C';
  quickReplies: string[];
}

export interface CasePreset {
  id: string;
  title: string;
  industry: string;
  badge: string;
  raw_jd: string;
  knowledge_base: {
    salary: string;
    location: string;
    benefits: string;
    work_hours: string;
    interview_process: string;
    notice_period: string;
    notes: string;
  };
  candidates: CandidatePreset[];
}
