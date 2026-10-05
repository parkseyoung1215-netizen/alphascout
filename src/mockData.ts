export type LangPath = 'stored_en' | 'translated_from_ko' | 'ko_fallback' | 'fresh_scan' | 'stored_ko';

export interface ScanResult {
  meta: ScanMeta;
  companyPage: "ok" | "blocked";
  companyDomainConfirmed: boolean;
  insufficientEvidence: boolean;
  companyOverview: SourceClaim;
  ceoInfo: SourceClaim;
  sources: string[];
  marketTiming: PillarScore;
  productMoat: PillarScore;
  executionTraction: PillarScore;
  riskControl: PillarScore;
  overallScore: OverallScore;
  coreClaims: CoreClaim[];
  provenFacts: ProvenFact[];
  uncertainties: Uncertainty[];
  techTrends: TechTrends;
  diagnostics: Diagnostics;
  _cached?: boolean;
  _cachedAt?: string;
  _langPath?: LangPath;
  _translatedFields?: string[];
  _langError?: string;
  _enUnavailable?: boolean;
  _stale?: boolean;
}

export interface CachedCompanyInfo {
  title: string;
  input: string;
  scannedAt: string;
}

export interface SourceClaim {
  statement: string;
  url: string;
  date: string;
  sourceType: string;
  isCompanyClaim: boolean;
}

export interface SignalDiagnostics {
  llmChunkIds: number;
  invalidChunkIds: number;
  invalidSignalMismatch: number;
  invalidNameMismatch: number;
  invalidNonExistent: number;
  finalChunkIds: number;
}

export interface SignalResult {
  id: string;
  name: string;
  criteria: string;
  judgment: '좋음' | '보통' | '나쁨' | '알 수 없음';
  evidence: '강함' | '보통' | '약함' | '없음';
  reasoning: string;
  url: string;
  date: string;
  sourceType: string;
  diagnostics: SignalDiagnostics;
}

export interface PillarScore {
  score: number;
  rangeLow: number;
  rangeHigh: number;
  evidenceCount: number;
  totalSignals: number;
  isHold: boolean;
  rangeText: string;
  statement: string;
  url: string;
  date: string;
  signals: SignalResult[];
}

export interface ScanMeta {
  source: string;
  type: 'article' | 'repository' | 'keyword' | 'website';
  title: string;
  scannedAt: string;
}

export interface OverallScore {
  score: number;
  grade: string;
  rationale: string;
  rangeLow: number;
  rangeHigh: number;
  rangeText: string;
  isHold: boolean;
  evidenceCount: number;
  totalSignals: number;
}

export interface CoreClaim {
  claim: string;
  category: string;
  url: string;
  date: string;
}

export interface ProvenFact {
  fact: string;
  evidence: string;
  confidence: '높음' | '중간' | '낮음';
  url: string;
  date: string;
}

export interface Uncertainty {
  risk: string;
  impact: string;
  url: string;
  date: string;
}

export interface TechTrends {
  summary: string;
  summaryHasEvidence: boolean;
  trends: { trend: string; relevance: string; url: string; date: string }[];
  marketImpact: string;
  marketImpactHasEvidence: boolean;
  glossary: GlossaryEntry[];
}

export interface GlossaryEntry {
  term: string;
  english: string;
  explanation: string;
}

export interface SignalSearchDiag {
  query: string;
  resultCount: number;
  scrapedPages: number;
  skipped: boolean;
  errorType: string | null;
  errorStatus: number | null;
}

export interface Diagnostics {
  pagesScraped: number;
  domainCounts: Record<string, number>;
  domainTypes: Record<string, string>;
  pageTextLengths: number[];
  totalChunks: number;
  signalDiagnostics: Record<string, SignalDiagnostics[]>;
  signalSearch: Record<string, SignalSearchDiag[]>;
  totalSearchCalls: number;
  skippedSignals: string[];
  searchDurationMs: number;
  llmFinishReason: string | null;
  companyDomains: string[];
  existenceCheck: { homepageOk: boolean; nameMatchedDomains: string[]; passed: boolean };
  searchFailureSummary?: {
    attempted: number;
    failed: number;
    failureRate: number;
    representativeError: string | null;
    errorBreakdown: Record<string, number>;
  };
}

export const samplePrompts = [
  'Anthropic',
  'OpenAI',
  'Tesla',
  'GitHub microsoft/BitNet',
];
