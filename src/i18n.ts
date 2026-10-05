export type Lang = 'ko' | 'en';

export const STRINGS = {
  // Header
  tagline: { ko: 'Deterministic VC Scanner', en: 'Deterministic VC Scanner' },
  apikeyConnected: { ko: 'API 키 연결됨', en: 'API key connected' },
  apikeyNeeded: { ko: '새 분석 시 키 필요', en: 'Key needed for new scans' },

  // Input bar
  placeholder: { ko: '테크 기업, AI 서비스, 또는 기술 키워드 입력 (예: Anthropic, OpenAI, Tesla)', en: 'Enter tech company, AI service, or tech keyword (e.g. Anthropic, OpenAI, Tesla)' },
  scanBtn: { ko: 'AI 심사 분석', en: 'AI Due Diligence' },
  scanning: { ko: '스캔 중...', en: 'Scanning...' },
  helperText: { ko: '* 고정 신호 기반 결정론적 평가 엔진 — 실시간 스크래핑 텍스트에서만 증거를 추출합니다.', en: '* Fixed-signal deterministic evaluation engine — evidence extracted only from real-time scraped text.' },
  sample: { ko: '샘플:', en: 'Samples:' },

  // Footer
  serverChecking: { ko: '서버 상태: 확인 중', en: 'Server: checking' },
  serverOk: { ko: '서버 상태: 정상', en: 'Server: online' },
  serverError: { ko: '서버 상태: 오류', en: 'Server: error' },
  disclaimer: { ko: '자동 생성된 분석이며 투자 조언이 아닙니다. 분석 시각 기준 정보입니다.', en: 'Automatically generated analysis, not investment advice. Reflects information as of the analysis time.' },
  analysisDate: { ko: '분석 기준 날짜', en: 'Analysis date' },

  // Settings modal
  settingsTitle: { ko: 'OpenAI API 설정', en: 'OpenAI API Settings' },
  settingsSubtitle: { ko: 'GPT-4o-mini 분석을 위한 키 입력', en: 'API key for GPT-4o-mini analysis' },
  apiKeyLabel: { ko: 'OpenAI API Key', en: 'OpenAI API Key' },
  apiKeySaved: { ko: 'API 키가 안전하게 저장되었습니다.', en: 'API key saved securely.' },
  apiKeyDesc: { ko: 'API 키는 브라우저에만 저장되며, 분석 요청 시 OpenAI 서버로 전송됩니다. 키는', en: 'The API key is stored only in your browser and sent to OpenAI servers during analysis. Get a key at' },
  apiKeyDelete: { ko: '키 삭제', en: 'Delete key' },
  apiKeySave: { ko: '저장', en: 'Save' },

  // Error state
  errNonTech: { ko: '기술 분야가 아닙니다', en: 'Not a tech field' },
  errValidation: { ko: '유효하지 않은 입력', en: 'Invalid input' },
  errScrapeFail: { ko: '스크래핑 실패', en: 'Scraping failed' },
  errNotFound: { ko: '기업 확인 불가', en: 'Company not found' },
  errSearchError: { ko: '검색 서비스 오류', en: 'Search service error' },
  errTranslateNeeded: { ko: '번역하려면 키가 필요합니다', en: 'Key required for translation' },
  errGeneric: { ko: '분석 중 오류가 발생했습니다', en: 'An error occurred during analysis' },
  retry: { ko: '다시 시도', en: 'Retry' },
  apiKeySettings: { ko: 'API 키 설정', en: 'API key settings' },

  // Empty state
  emptyTitle1: { ko: '고정 신호 기반', en: 'Fixed-signal based' },
  emptyTitle2: { ko: '결정론적 평가', en: 'deterministic evaluation' },
  emptyTitle3: { ko: '엔진', en: 'engine' },
  emptyDesc: { ko: '테크 기업명을 입력하면 실시간 스크래핑 후 20개 고정 신호(축당 5개)를 코드로 정의된 기준에 따라 평가하고, 근거 수준 가중치로 점수를 산출합니다. AI가 점수를 임의로 정하지 못합니다.', en: 'Enter a tech company name — after real-time scraping, 20 fixed signals (5 per pillar) are evaluated against code-defined criteria, and scores are calculated using evidence-level weights. The AI cannot assign scores arbitrarily.' },
  pillarTiming: { ko: '시장 & 타이밍', en: 'Market & Timing' },
  pillarMoat: { ko: '제품 & 해자', en: 'Product & Moat' },
  pillarExecution: { ko: '실행 & 트랙션', en: 'Execution & Traction' },
  pillarRisk: { ko: '리스크 관리', en: 'Risk Management' },
  fixedSignals: { ko: '5개 고정 신호', en: '5 fixed signals' },

  // Scanning state
  scanProgressTitle: { ko: '결정론적 신호 평가 진행 중', en: 'Deterministic signal evaluation in progress' },
  scanStep1: { ko: '실시간 웹 스크래핑 중...', en: 'Real-time web scraping...' },
  scanStep2: { ko: '20개 고정 신호 평가 중...', en: 'Evaluating 20 fixed signals...' },
  scanStep3: { ko: '근거 수준 가중치 계산...', en: 'Calculating evidence-level weights...' },
  scanStep4: { ko: '점수 및 범위 산출...', en: 'Computing scores and ranges...' },

  // Cached banner
  cachedResult: { ko: '저장된 결과', en: 'Cached result' },
  cachedAt: { ko: '분석 시각', en: 'analyzed at' },
  refreshAnalysis: { ko: '새로 분석', en: 'Re-analyze' },

  // Results view meta
  typeRepo: { ko: 'GitHub 저장소', en: 'GitHub repository' },
  typeKeyword: { ko: '기업/기술', en: 'Company / Tech' },
  typeWebsite: { ko: '웹사이트', en: 'Website' },
  typeArticle: { ko: '기술 기사', en: 'Tech article' },
  evalComplete: { ko: '결정론적 평가 완료', en: 'Deterministic evaluation complete' },

  // Insufficient evidence
  cannotVerify: { ko: '확인 불가', en: 'Cannot verify' },
  cannotVerifyDesc: { ko: '회사를 확인하지 못했거나 공개 자료가 거의 없습니다.', en: 'Could not identify the company or very little public information is available.' },

  // Accordion sections
  coreClaimsTitle: { ko: 'Core Claims', en: 'Core Claims' },
  coreClaimsSub: { ko: '이 기술/기업이 주장하는 핵심 가치와 비전', en: 'Core value propositions and vision claimed by this tech/company' },
  provenFactsTitle: { ko: 'Proven Facts', en: 'Proven Facts' },
  provenFactsSub: { ko: '출처 URL과 날짜가 모두 있는 검증된 사실 (회사 자체 출처 제외)', en: 'Verified facts with both source URL and date (company sources excluded)' },
  provenFactsEmpty: { ko: '조건을 만족하는 검증된 사실이 없습니다.', en: 'No verified facts meet the criteria.' },
  companyClaimsTitle: { ko: '회사 주장', en: 'Company Claims' },
  companyClaimsSub: { ko: '회사 자체 출처만 근거로 하는 핵심 주장 (독립 검증 미완료)', en: 'Claims backed only by company sources (not independently verified)' },
  companyClaimsEmpty: { ko: '회사 주장 항목이 없습니다.', en: 'No company claims.' },
  uncertaintiesTitle: { ko: 'Uncertainties & Risks', en: 'Uncertainties & Risks' },
  uncertaintiesSub: { ko: '아직 검증되지 않았거나 불확실한 리스크, 한계점', en: 'Unverified risks, uncertainties, and limitations' },
  techTrendsTitle: { ko: 'Tech Trends & Market Impact', en: 'Tech Trends & Market Impact' },
  techTrendsSub: { ko: '관련 기술 트렌드 및 시장에 미치는 영향', en: 'Related tech trends and market impact' },
  trendSummary: { ko: '트렌드 요약', en: 'Trend summary' },
  trendSummaryNoEvidence: { ko: '트렌드 요약: 근거 부족으로 표시하지 않음', en: 'Trend summary: hidden due to insufficient evidence' },
  marketImpact: { ko: '시장 임팩트', en: 'Market impact' },
  marketImpactNoEvidence: { ko: '시장 임팩트: 근거 부족으로 표시하지 않음', en: 'Market impact: hidden due to insufficient evidence' },
  techGlossary: { ko: '기술 용어 해설', en: 'Tech glossary' },
  sourcesTitle: { ko: '참고 출처', en: 'Sources' },

  // Company overview card
  companyBlocked: { ko: '회사 홈페이지 접근이 차단되어 회사 자체 출처가 없습니다.', en: 'Company homepage is blocked, so no company-sourced references are available.' },
  companyOverview: { ko: '기업 소개', en: 'Company overview' },
  ceoLabel: { ko: '최고경영자', en: 'Chief Executive Officer' },

  // Overall score section
  overallScoreTitle: { ko: '고정 신호 기반 결정론적 평가', en: 'Fixed-signal deterministic evaluation' },
  rangeScore: { ko: 'Range Score', en: 'Range Score' },
  evidenceCoverage: { ko: '근거 확보', en: 'Evidence' },
  rationale: { ko: '평가 근거', en: 'Rationale' },
  holdLabel: { ko: '보류', en: 'Hold' },

  // Judgment labels (stored value → display label)
  judgGood: { ko: '좋음', en: 'Good' },
  judgAverage: { ko: '보통', en: 'Average' },
  judgBad: { ko: '나쁨', en: 'Bad' },
  judgUnknown: { ko: '알 수 없음', en: 'Unknown' },

  // Evidence labels (stored value → display label)
  evStrong: { ko: '강함', en: 'Strong' },
  evModerate: { ko: '보통', en: 'Moderate' },
  evWeak: { ko: '약함', en: 'Weak' },
  evNone: { ko: '없음', en: 'None' },

  // Confidence labels
  confHigh: { ko: '높음', en: 'High' },
  confMid: { ko: '중간', en: 'Medium' },
  confLow: { ko: '낮음', en: 'Low' },

  // Source type labels (stored value → display label)
  srcRegulatory: { ko: '공시·규제', en: 'Filing/Regulatory' },
  srcIndependent: { ko: '독립', en: 'Independent' },
  srcCompany: { ko: '회사 자체', en: 'Company' },
  srcCompanyClaim: { ko: '회사 주장', en: 'Company claim' },

  // Date/source placeholder labels
  noSource: { ko: '출처 없음', en: 'No source' },
  noDate: { ko: '날짜 없음', en: 'No date' },

  // Template rationale/rangeText strings (code-generated, not LLM free text)
  tmplHoldRationale: { ko: '평가 보류 (근거 부족)', en: 'Evaluation on hold (insufficient evidence)' },
  tmplHoldRange: { ko: '평가 보류 (근거 부족)', en: 'Evaluation on hold (insufficient evidence)' },
  tmplHoldPillarRange: { ko: '평가 보류 (근거 부족)', en: 'Evaluation on hold (insufficient evidence)' },
  tmplScoreSummary: { ko: '4-pillar 종합 점수', en: '4-pillar composite score' },
  tmplEvidenceRatio: { ko: '근거 확보', en: 'evidence coverage' },
  tmplHeldPillars: { ko: '보류된 축', en: 'held pillars' },

  // Signal names (20 fixed signals, by id)
  sig_mt1: { ko: '시장 규모', en: 'Market size' },
  sig_mt2: { ko: '성장 수치와 기간', en: 'Growth metrics & period' },
  sig_mt3: { ko: '수요 증거', en: 'Demand evidence' },
  sig_mt4: { ko: '타이밍 사건', en: 'Timing events' },
  sig_mt5: { ko: '경쟁 밀도', en: 'Competitive density' },
  sig_pm1: { ko: '독립 평가', en: 'Independent evaluation' },
  sig_pm2: { ko: '기술 차별성', en: 'Tech differentiation' },
  sig_pm3: { ko: '전환 비용·락인', en: 'Switching cost / lock-in' },
  sig_pm4: { ko: '데이터·유통 우위', en: 'Data / distribution advantage' },
  sig_pm5: { ko: '외부 모델 의존도', en: 'External model dependency' },
  sig_et1: { ko: '매출·성장', en: 'Revenue & growth' },
  sig_et2: { ko: '고객', en: 'Customers' },
  sig_et3: { ko: '투자 유치', en: 'Funding' },
  sig_et4: { ko: '최근 12개월 제품 출시', en: 'Product launches (last 12mo)' },
  sig_et5: { ko: '인력 변동', en: 'Personnel changes' },
  sig_rc1: { ko: '규제·법적 노출', en: 'Regulatory / legal exposure' },
  sig_rc2: { ko: '핵심 인물 의존', en: 'Key person dependency' },
  sig_rc3: { ko: '안전·보안 사고', en: 'Safety / security incidents' },
  sig_rc4: { ko: '자금 지속성', en: 'Funding runway' },
  sig_rc5: { ko: '컴퓨트·공급망 의존', en: 'Compute / supply chain dependency' },

  // Diagnostics
  diagnosticsTitle: { ko: '개발용 진단 로그 (chunk 검증, 신호별 검색, 수집 통계)', en: 'Dev diagnostics (chunk validation, per-signal search, scraping stats)' },
  pagesScraped: { ko: '수집 페이지', en: 'Pages scraped' },
  totalChunks: { ko: '조각 총수', en: 'Total chunks' },
  searchCalls: { ko: '검색 호출', en: 'Search calls' },
  searchDuration: { ko: '검색 소요', en: 'Search duration' },
  skippedSignals: { ko: '건너뛴 신호', en: 'Skipped signals' },
  searchFailure: { ko: '검색 호출 실패', en: 'Search call failures' },
  failureRate: { ko: '실패율', en: 'failure rate' },
  representativeError: { ko: '대표 오류', en: 'Representative error' },
  llmTruncated: { ko: 'LLM 응답이 토큰 제한(finish_reason: length)으로 잘렸습니다. 일부 신호가 누락되었을 수 있습니다.', en: 'LLM response was truncated due to token limit (finish_reason: length). Some signals may be missing.' },
  skippedByLimit: { ko: '검색 한도 초과로 건너뛴 신호', en: 'Signals skipped due to search limit' },
  perSignalSearch: { ko: '신호별 검색어 및 결과 수', en: 'Per-signal search queries and results' },
  skippedLabel: { ko: '건너뜀', en: 'skipped' },
  resultLabel: { ko: '결과', en: 'results' },
  scrapedLabel: { ko: '수집', en: 'scraped' },
  errorLabel: { ko: '오류', en: 'error' },
  confirmedDomains: { ko: '확정된 회사 도메인', en: 'Confirmed company domains' },
  existenceCheck: { ko: '존재 확인', en: 'Existence check' },
  passed: { ko: '통과', en: 'passed' },
  failed: { ko: '실패', en: 'failed' },
  homepageLabel: { ko: '홈페이지', en: 'Homepage' },
  okLabel: { ko: 'OK', en: 'OK' },
  noneLabel: { ko: '없음', en: 'none' },
  nameMatchDomains: { ko: '이름 매칭 도메인', en: 'Name-matched domains' },
  domainChunkCounts: { ko: '도메인별 조각 수', en: 'Chunk count per domain' },
  pageTextLengths: { ko: '페이지별 텍스트 길이', en: 'Page text lengths' },
  perSignalChunk: { ko: '신호별 chunk 검증', en: 'Per-signal chunk validation' },
  deletedLabel: { ko: '삭제', en: 'removed' },
  signalMismatch: { ko: '신호불일치', en: 'signal mismatch' },
  nameMismatch: { ko: '이름불일치', en: 'name mismatch' },
  nonExistent: { ko: '미존재', en: 'non-existent' },
  passedLabel: { ko: '통과', en: 'passed' },

  // Language path diagnostics
  langPathLabel: { ko: '응답 경로', en: 'Response path' },
  langPathStoredEn: { ko: '저장된 영어 결과', en: 'Stored English result' },
  langPathTranslatedFromKo: { ko: '한국어 결과에서 번역', en: 'Translated from Korean' },
  langPathKoFallback: { ko: '한국어 결과 폴백 (번역 실패)', en: 'Korean fallback (translation failed)' },
  langPathFreshScan: { ko: '새 분석', en: 'Fresh scan' },
  langPathStoredKo: { ko: '저장된 한국어 결과', en: 'Stored Korean result' },
  translatedFieldsLabel: { ko: '번역된 필드', en: 'Translated fields' },
  langErrorLabel: { ko: '경로 오류', en: 'Path error' },

  // KO fallback banner
  koFallbackBanner: { ko: '일부 내용이 번역되지 않았습니다.', en: 'Some content is not translated.' },

  // EN unavailable banner (keyless visitor, en request, only ko cache exists)
  enUnavailableBanner: { ko: '영어 버전이 아직 준비되지 않았습니다. 한국어 저장본을 표시합니다.', en: 'English version is not available yet. Showing the Korean saved result.' },

  // Cached companies list (shown in error state when key/limit blocks new scan)
  cachedCompaniesTitle: { ko: '지금 볼 수 있는 저장된 회사', en: 'Saved companies you can view now' },
  dailyLimitReached: { ko: '오늘은 새 분석 한도에 도달했습니다', en: 'Daily scan limit reached for today' },
  analyzedAt: { ko: '분석 시각', en: 'analyzed' },

  // Stale badge (cached result older than 7 days)
  staleBadge: { ko: '오래된 결과', en: 'Stale result' },

  // Key-needed error title
  onlySavedTitle: { ko: '저장된 결과만 볼 수 있어요', en: 'Only saved results are available' },

  // Language selector
  langKo: { ko: '한국어', en: 'Korean' },
  langEn: { ko: 'English', en: 'English' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}

// ─── Value → i18n key maps for fixed-label fields ───
// Stored values are always Korean; these maps convert to the display label for the chosen language.

export const JUDGMENT_KEY: Record<string, StringKey> = {
  '좋음': 'judgGood',
  '보통': 'judgAverage',
  '나쁨': 'judgBad',
  '알 수 없음': 'judgUnknown',
};

export const EVIDENCE_KEY: Record<string, StringKey> = {
  '강함': 'evStrong',
  '보통': 'evModerate',
  '약함': 'evWeak',
  '없음': 'evNone',
};

export const CONFIDENCE_KEY: Record<string, StringKey> = {
  '높음': 'confHigh',
  '중간': 'confMid',
  '낮음': 'confLow',
};

export const SOURCE_TYPE_KEY: Record<string, StringKey> = {
  '공시·규제': 'srcRegulatory',
  '독립': 'srcIndependent',
  '회사 자체': 'srcCompany',
  '회사 주장': 'srcCompanyClaim',
};

// ─── Display helper: translate a stored value to the display label ───
export function labelValue(value: string, keyMap: Record<string, StringKey>, lang: Lang): string {
  const key = keyMap[value];
  return key ? t(key, lang) : value;
}

// ─── Signal name by id ───
export function signalName(id: string, lang: Lang): string {
  const key = `sig_${id}` as StringKey;
  const entry = STRINGS[key];
  return entry ? entry[lang] : id;
}
