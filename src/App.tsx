import { useState, useEffect } from 'react';
import {
  Search, Link2, FileText, Sparkles, Loader2, Zap, TrendingUp, BookOpen,
  Target, AlertTriangle, Star, Clock, Globe, GitBranch, ChevronRight,
  Settings, X, Key, Eye, EyeOff, Check, AlertCircle,
  ChevronDown, Gauge, Megaphone, ShieldCheck, Lightbulb, BarChart3, User,
  ExternalLink, HelpCircle, Scale, Terminal, Building2, RefreshCw,
} from 'lucide-react';
import { samplePrompts, type ScanResult, type PillarScore, type SignalResult, type Diagnostics as DiagnosticsType, type SourceClaim, type CachedCompanyInfo } from '@/mockData';
import { t, type Lang, type StringKey, labelValue, signalName, JUDGMENT_KEY, EVIDENCE_KEY, SOURCE_TYPE_KEY, CONFIDENCE_KEY } from '@/i18n';

type Status = 'idle' | 'scanning' | 'done' | 'error';

const API_KEY_STORAGE = 'alphascout_openai_key';
const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scan-trend`;

function App() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorDiagnostics, setErrorDiagnostics] = useState<DiagnosticsType | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [keySaved, setKeySaved] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [serverCheckedAt, setServerCheckedAt] = useState('');
  const [cachedAt, setCachedAt] = useState<string | null>(null);
  const [cachedCompanies, setCachedCompanies] = useState<CachedCompanyInfo[]>([]);
  const [limitReached, setLimitReached] = useState(false);
  const [lang, setLang] = useState<Lang>('ko');

  useEffect(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE) || '';
    setApiKey(saved);
    setKeySaved(!!saved);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langParam = params.get('lang');
    if (langParam === 'en' || langParam === 'ko') {
      setLang(langParam);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (lang === 'ko') {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url.toString());
  }, [lang]);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(EDGE_FUNCTION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ ping: true }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ok === true) {
            setServerStatus('ok');
          } else {
            setServerStatus('error');
          }
        } else {
          setServerStatus('error');
        }
      } catch {
        setServerStatus('error');
      }
      setServerCheckedAt(new Date().toLocaleTimeString(lang === 'en' ? 'en-US' : 'ko-KR'));
    };
    checkServer();
  }, [lang]);

  const handleScan = async (forceRefresh = false) => {
    if (!input.trim() || status === 'scanning') return;

    setStatus('scanning');
    setResult(null);
    setErrorMsg('');
    setErrorDiagnostics(null);
    setCachedAt(null);
    setCachedCompanies([]);
    setLimitReached(false);

    try {
      const response = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          input: input.trim(),
          openaiApiKey: apiKey.trim(),
          forceRefresh,
          lang,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.diagnostics) setErrorDiagnostics(data.diagnostics as DiagnosticsType);
        if (data.cachedCompanies) setCachedCompanies(data.cachedCompanies as CachedCompanyInfo[]);
        if (data.limitReached) setLimitReached(true);
        throw new Error(data.error || `분석 실패 (${response.status})`);
      }

      if (!data.marketTiming || !data.productMoat || !data.executionTraction || !data.riskControl) {
        throw new Error('AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요.');
      }

      if (data._cached && data._cachedAt) {
        setCachedAt(data._cachedAt);
      }
      setResult(data as ScanResult);
      setStatus('done');
    } catch (err) {
      const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setErrorMsg(message);
      setStatus('error');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleScan();
    }
  };

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE, apiKey.trim());
      setKeySaved(true);
      setSettingsOpen(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem(API_KEY_STORAGE);
    setApiKey('');
    setKeySaved(false);
  };

  const isRepo = input.toLowerCase().includes('github.com') || input.toLowerCase().includes('github ');

  return (
    <div className="min-h-screen flex flex-col">
      {settingsOpen && (
        <SettingsModal
          apiKey={apiKey}
          setApiKey={setApiKey}
          keySaved={keySaved}
          onSave={handleSaveKey}
          onClear={handleClearKey}
          onClose={() => setSettingsOpen(false)}
          lang={lang}
        />
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Zap className="w-5 h-5 text-zinc-950" strokeWidth={2.5} />
                </div>
                <div className="absolute -inset-0.5 rounded-xl bg-emerald-500/20 blur-md -z-10" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white leading-none">AlphaScout</h1>
                <p className="text-[11px] text-zinc-500 font-medium tracking-wide uppercase mt-0.5">{t('tagline', lang)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {keySaved ? (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-medium font-korean">{t('apikeyConnected', lang)}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <span className="w-2 h-2 rounded-full bg-zinc-600" />
                    <span className="font-medium font-korean">{t('apikeyNeeded', lang)}</span>
                  </span>
                )}
              </div>
              <div className="h-5 w-px bg-zinc-800 hidden sm:block" />
              <span className="hidden sm:inline text-xs text-zinc-600 font-mono">v4.0</span>
              <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-900/50 p-0.5">
                <button
                  onClick={() => setLang('ko')}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${lang === 'ko' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  한국어
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${lang === 'en' ? 'bg-emerald-500/20 text-emerald-300' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  English
                </button>
              </div>
              <button
                onClick={() => setSettingsOpen(true)}
                className="relative w-9 h-9 rounded-lg border border-zinc-800 bg-zinc-900/50 flex items-center justify-center text-zinc-400 hover:text-emerald-300 hover:border-emerald-700/50 transition-all"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
                {!keySaved && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Input bar */}
          <div className="pb-5">
            <div className="glow-border flex items-center gap-2 sm:gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-2 pl-4 transition-all">
              <div className="flex items-center gap-2 text-emerald-400 shrink-0">
                {isRepo ? <GitBranch className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder', lang)}
                className="flex-1 bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-600 outline-none font-korean"
                disabled={status === 'scanning'}
              />
              {input && (
                <button
                  onClick={() => setInput('')}
                  className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 shrink-0"
                  aria-label="Clear input"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              )}
              <button
                onClick={() => handleScan()}
                disabled={!input.trim() || status === 'scanning'}
                className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 sm:px-6 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
              >
                {status === 'scanning' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">{t('scanning', lang)}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('scanBtn', lang)}</span>
                    <Sparkles className="w-4 h-4 sm:hidden" />
                  </>
                )}
              </button>
            </div>

            {/* Helper text */}
            <p className="text-xs text-zinc-600 text-center mt-2.5 font-korean">
              {t('helperText', lang)}
            </p>

            {status === 'idle' && !result && (
              <div className="flex flex-wrap items-center gap-2 mt-3 animate-fade-in">
                <span className="text-xs text-zinc-600 font-medium">{t('sample', lang)}</span>
                {samplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(p)}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-xs text-zinc-400 hover:text-emerald-300 hover:border-emerald-700/50 transition-all font-korean"
                  >
                    {p.toLowerCase().includes('github') ? <GitBranch className="w-3 h-3" /> : <Search className="w-3 h-3" />}
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {status === 'idle' && !result && <EmptyState lang={lang} />}
        {status === 'scanning' && <ScanningState input={input} lang={lang} />}
        {status === 'done' && result && <ResultsView result={result} cachedAt={cachedAt} onRefresh={() => handleScan(true)} lang={lang} hasKey={keySaved} />}
        {status === 'error' && <ErrorState message={errorMsg} diagnostics={errorDiagnostics} onRetry={() => setStatus('idle')} onOpenSettings={() => setSettingsOpen(true)} lang={lang} cachedCompanies={cachedCompanies} limitReached={limitReached} onSelectCompany={(name) => { setInput(name); setStatus('idle'); }} />}
      </main>

      {/* Footer with disclaimer */}
      <footer className="border-t border-zinc-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-700">
            <span className="font-mono">AlphaScout © 2026</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                {serverStatus === 'checking' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-zinc-600 animate-pulse" />
                    <span className="text-zinc-500 font-korean">{t('serverChecking', lang)}</span>
                  </>
                ) : serverStatus === 'ok' ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 font-korean">{t('serverOk', lang)}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-red-400 font-korean">{t('serverError', lang)}</span>
                  </>
                )}
                {serverCheckedAt && <span className="text-zinc-600 font-mono">({serverCheckedAt})</span>}
              </span>
              <span className="flex items-center gap-1.5">
                Powered by <span className="text-emerald-500 font-medium">GPT-4o-mini</span>
              </span>
            </div>
          </div>
          <p className="text-[11px] text-zinc-600 font-korean text-center">
            {t('disclaimer', lang)} {t('analysisDate', lang)}: {new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)}
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── Settings Modal ───

function SettingsModal({
  apiKey, setApiKey, keySaved, onSave, onClear, onClose, lang,
}: {
  apiKey: string;
  setApiKey: (v: string) => void;
  keySaved: boolean;
  onSave: () => void;
  onClear: () => void;
  onClose: () => void;
  lang: Lang;
}) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div className="glass-card w-full max-w-md p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{t('settingsTitle', lang)}</h2>
              <p className="text-xs text-zinc-500 font-korean">{t('settingsSubtitle', lang)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="text-xs text-zinc-500 font-korean block">{t('apiKeyLabel', lang)}</label>
          <div className="glow-border flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2.5">
            <Key className="w-4 h-4 text-zinc-600 shrink-0" />
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 outline-none font-mono"
            />
            <button onClick={() => setShowKey(!showKey)} className="text-zinc-600 hover:text-zinc-300 transition-colors shrink-0">
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {keySaved && (
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span className="font-korean">{t('apiKeySaved', lang)}</span>
            </div>
          )}

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
            <p className="text-xs text-zinc-500 leading-relaxed font-korean">
              {t('apiKeyDesc', lang)} <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">platform.openai.com/api-keys</a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          {keySaved && (
            <button
              onClick={onClear}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-400 hover:border-red-800/40 transition-all font-korean"
            >
              {t('apiKeyDelete', lang)}
            </button>
          )}
          <button
            onClick={onSave}
            disabled={!apiKey.trim()}
            className="flex-1 btn-glow rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-4 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none font-korean"
          >
            {t('apiKeySave', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Error State ───

function ErrorState({ message, diagnostics, onRetry, onOpenSettings, lang, cachedCompanies, limitReached, onSelectCompany }: { message: string; diagnostics: DiagnosticsType | null; onRetry: () => void; onOpenSettings: () => void; lang: Lang; cachedCompanies: CachedCompanyInfo[]; limitReached: boolean; onSelectCompany: (name: string) => void }) {
  const isValidation = message.includes('Invalid URL or unknown company');
  const isNonTech = message.includes('기술 분야가 아닌');
  const isScrapeFail = message.includes('실시간 웹 스크래핑에 실패');
  const isNotFound = message.includes('확인 불가');
  const isSearchError = message.includes('검색 서비스 오류');
  const isKeyNeeded = message.includes('새 분석에는 OpenAI API 키가 필요합니다');
  const isTranslateNeeded = message.includes('번역하려면 OpenAI API 키가 필요합니다');
  const isWarning = isValidation || isNonTech || isScrapeFail || isNotFound || isSearchError || isKeyNeeded || isTranslateNeeded;
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 animate-fade-in">
      <div className="relative mb-6">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${isWarning ? 'bg-amber-500/10 border border-amber-800/40' : 'bg-red-500/10 border border-red-800/40'}`}>
          {isWarning ? <AlertTriangle className="w-9 h-9 text-amber-400" strokeWidth={1.5} /> : <AlertCircle className="w-9 h-9 text-red-400" strokeWidth={1.5} />}
        </div>
        <div className={`absolute -inset-2 rounded-2xl blur-2xl -z-10 ${isWarning ? 'bg-amber-500/10' : 'bg-red-500/10'}`} />
      </div>
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight font-korean">
        {isNonTech ? t('errNonTech', lang) : isValidation ? t('errValidation', lang) : isScrapeFail ? t('errScrapeFail', lang) : isNotFound ? t('errNotFound', lang) : isSearchError ? t('errSearchError', lang) : isTranslateNeeded ? t('errTranslateNeeded', lang) : isKeyNeeded ? t('onlySavedTitle', lang) : t('errGeneric', lang)}
      </h2>
      <p className="text-sm text-zinc-500 max-w-md font-korean leading-relaxed mb-6">{limitReached ? t('dailyLimitReached', lang) : message}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          className="btn-glow flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-zinc-950 font-korean"
        >
          <Sparkles className="w-4 h-4" />
          {t('retry', lang)}
        </button>
        {(isKeyNeeded || isTranslateNeeded) && (
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-emerald-300 hover:border-emerald-700/50 transition-all font-korean"
          >
            <Settings className="w-4 h-4" />
            {t('apiKeySettings', lang)}
          </button>
        )}
      </div>
      {cachedCompanies.length > 0 && (
        <div className="w-full max-w-2xl mt-8 text-left animate-fade-in">
          <p className="text-xs text-zinc-500 font-korean mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            {t('cachedCompaniesTitle', lang)}
          </p>
          <div className="flex flex-wrap gap-2">
            {cachedCompanies.map((c, i) => (
              <button
                key={i}
                onClick={() => onSelectCompany(c.input)}
                className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-300 hover:text-emerald-300 hover:border-emerald-700/50 transition-all"
              >
                <Search className="w-3 h-3 text-zinc-600" />
                <span className="font-korean">{c.title}</span>
                {c.scannedAt && (
                  <span className="text-[10px] text-zinc-600 font-mono">
                    ({t('analyzedAt', lang)}: {new Date(c.scannedAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'ko-KR')})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      {diagnostics && (
        <div className="w-full max-w-3xl mt-8 text-left">
          <DiagnosticsPanel diagnostics={diagnostics} lang={lang} />
        </div>
      )}
    </div>
  );
}

// ─── Empty State ───

function EmptyState({ lang }: { lang: Lang }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24 animate-fade-in">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-700/10 border border-emerald-800/40 flex items-center justify-center">
          <Search className="w-9 h-9 text-emerald-400" strokeWidth={1.5} />
        </div>
        <div className="absolute -inset-2 rounded-2xl bg-emerald-500/10 blur-2xl -z-10" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight font-korean">
        {t('emptyTitle1', lang)} <span className="gradient-text">{t('emptyTitle2', lang)}</span> {t('emptyTitle3', lang)}
      </h2>
      <p className="text-sm text-zinc-500 max-w-md font-korean leading-relaxed">
        {t('emptyDesc', lang)}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-10 w-full max-w-3xl">
        {[
          { icon: TrendingUp, label: t('pillarTiming', lang), desc: t('fixedSignals', lang) },
          { icon: ShieldCheck, label: t('pillarMoat', lang), desc: t('fixedSignals', lang) },
          { icon: Gauge, label: t('pillarExecution', lang), desc: t('fixedSignals', lang) },
          { icon: AlertTriangle, label: t('pillarRisk', lang), desc: t('fixedSignals', lang) },
        ].map((item, i) => (
          <div key={i} className={`glass-card p-4 text-left animate-fade-in-up stagger-${i + 1}`}>
            <item.icon className="w-5 h-5 text-emerald-400 mb-2" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-zinc-200 font-korean">{item.label}</p>
            <p className="text-xs text-zinc-600 mt-0.5 font-korean">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Scanning State ───

function ScanningState({ input, lang }: { input: string; lang: Lang }) {
  const steps = [
    t('scanStep1', lang),
    t('scanStep2', lang),
    t('scanStep3', lang),
    t('scanStep4', lang),
  ];
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-800/30 bg-emerald-950/20 p-6">
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent scan-line" />
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl border-2 border-emerald-500/30 border-t-emerald-400 animate-spin-slow" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-emerald-300 mb-1 font-korean">{t('scanProgressTitle', lang)}</p>
            <p className="text-xs text-zinc-500 font-mono truncate">{input}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div className="h-6 w-48 shimmer rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-20 shimmer rounded" />
              <div className="h-8 w-full shimmer rounded-lg" />
            </div>
          ))}
        </div>
        <div className="h-4 w-full shimmer rounded" />
        <div className="h-4 w-4/5 shimmer rounded" />
      </div>

      <div className="glass-card p-5 space-y-3">
        <div className="h-5 w-40 shimmer rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500/40 mt-2 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-full shimmer rounded" />
              <div className="h-3 w-3/4 shimmer rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-zinc-600">
            <Loader2 className="w-3 h-3 animate-spin text-emerald-500/60" />
            <span className="font-korean">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Results View ───

function ResultsView({ result, cachedAt, onRefresh, lang, hasKey }: { result: ScanResult; cachedAt: string | null; onRefresh: () => void; lang: Lang; hasKey: boolean }) {
  return (
    <div className="space-y-6">
      {/* Cached result banner */}
      {cachedAt && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-800/30 bg-blue-950/20 px-4 py-3 animate-fade-in-up">
          <Check className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs text-blue-300 font-korean">
            {t('cachedResult', lang)} ({t('cachedAt', lang)}: {new Date(cachedAt).toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR', { timeZone: 'Asia/Seoul' })})
          </span>
          {result._stale && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-800/30 rounded-full px-2 py-0.5 font-korean">
              <Clock className="w-3 h-3" />
              {t('staleBadge', lang)}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={!hasKey}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-blue-800/40 bg-blue-900/30 px-3 py-1.5 text-xs font-medium text-blue-300 hover:text-blue-200 hover:border-blue-700/50 transition-all font-korean disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-blue-300 disabled:hover:border-blue-800/40"
          >
            <RefreshCw className="w-3 h-3" />
            {t('refreshAnalysis', lang)}
          </button>
        </div>
      )}
      {result._langPath === 'ko_fallback' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-800/30 bg-amber-950/20 px-4 py-3 animate-fade-in-up">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-amber-300 font-korean">{t('koFallbackBanner', lang)}</span>
        </div>
      )}
      {result._enUnavailable && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-800/30 bg-amber-950/20 px-4 py-3 animate-fade-in-up">
          <Globe className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs text-amber-300 font-korean">{t('enUnavailableBanner', lang)}</span>
        </div>
      )}
      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs animate-fade-in-up">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
          {result.meta.type === 'repository' ? <GitBranch className="w-3.5 h-3.5 text-emerald-400" /> : result.meta.type === 'keyword' ? <Search className="w-3.5 h-3.5 text-emerald-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="text-zinc-400 font-medium font-korean">{result.meta.type === 'repository' ? t('typeRepo', lang) : result.meta.type === 'keyword' ? t('typeKeyword', lang) : result.meta.type === 'website' ? t('typeWebsite', lang) : t('typeArticle', lang)}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400 font-mono">{result.meta.source}</span>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400 font-mono">{new Date(result.meta.scannedAt).toLocaleString(lang === 'en' ? 'en-US' : 'ko-KR')}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 ml-auto">
          <span className="text-xs font-semibold font-korean">{t('evalComplete', lang)}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight animate-fade-in-up stagger-1 leading-snug">
        {result.meta.title}
      </h2>

      {/* Company Overview & CEO Info */}
      <CompanyOverviewCard result={result} lang={lang} />

      {/* Insufficient evidence guard */}
      {result.insufficientEvidence ? (
        <div className="glass-card p-8 text-center animate-fade-in-up stagger-2">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <p className="text-base text-amber-300 font-korean mb-1">{t('cannotVerify', lang)}</p>
          <p className="text-sm text-zinc-500 font-korean">{t('cannotVerifyDesc', lang)}</p>
        </div>
      ) : (
        <>
      {/* Section 1: Overall Score */}
      <OverallScoreSection result={result} lang={lang} />

      {/* Section 2: Core Claims */}
      <AccordionSection
        sectionId="core-claims"
        icon={Megaphone}
        title={t('coreClaimsTitle', lang)}
        subtitle={t('coreClaimsSub', lang)}
        defaultOpen
      >
        <div className="space-y-3">
          {result.coreClaims.map((item, i) => (
            <div key={i} className={`flex items-start gap-3 animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}>
              <div className="shrink-0 mt-0.5">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center text-xs font-bold text-emerald-400 font-mono">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-zinc-200 leading-relaxed font-korean">{item.claim}</p>
                {item.category && (
                  <span className="inline-block mt-1.5 text-[10px] font-medium text-emerald-400/70 bg-emerald-500/5 border border-emerald-800/30 rounded-full px-2 py-0.5 font-korean">
                    {item.category}
                  </span>
                )}
                <SourceBadge url={item.url} date={item.date} />
              </div>
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Section 3: Proven Facts — filtered: URL+date present */}
      <AccordionSection
        sectionId="proven-facts"
        icon={ShieldCheck}
        title={t('provenFactsTitle', lang)}
        subtitle={t('provenFactsSub', lang)}
        defaultOpen
      >
        <div className="space-y-3">
          {(() => {
            const validItems = result.provenFacts.filter(item => {
              const hasUrl = item.url && item.url.trim().length > 0 && item.url !== '확인된 정보 없음' && item.url !== '날짜 없음' && item.url !== '출처 없음';
              const hasDate = item.date && item.date.trim().length > 0 && item.date !== '확인된 정보 없음' && item.date !== '날짜 없음' && item.date !== '출처 없음';
              return hasUrl && hasDate;
            });
            if (validItems.length === 0) {
              return <p className="text-sm text-zinc-600 font-korean text-center py-4">{t('provenFactsEmpty', lang)}</p>;
            }
            return validItems.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 hover:border-emerald-800/40 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-zinc-200 leading-relaxed font-korean">{item.fact}</p>
                  </div>
                </div>
                {item.evidence && (
                  <div className="ml-6.5 pl-1 mt-2 flex items-start gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-zinc-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-500 leading-relaxed font-korean">{item.evidence}</p>
                  </div>
                )}
                <SourceBadge url={item.url} date={item.date} />
              </div>
            ));
          })()}
        </div>
      </AccordionSection>

      {/* Section 3b: Company Claims */}
      <AccordionSection
        sectionId="company-claims"
        icon={Building2}
        title={t('companyClaimsTitle', lang)}
        subtitle={t('companyClaimsSub', lang)}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {result.coreClaims.length === 0 ? (
            <p className="text-sm text-zinc-600 font-korean text-center py-4">{t('companyClaimsEmpty', lang)}</p>
          ) : (
            result.coreClaims.map((item, i) => (
              <div
                key={i}
                className={`rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 hover:border-amber-800/40 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}
              >
                <div className="flex items-start gap-2.5 mb-2">
                  <Building2 className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-zinc-200 leading-relaxed font-korean">{item.claim}</p>
                </div>
                {item.category && (
                  <span className="inline-block ml-6.5 text-[10px] font-medium text-amber-400/70 bg-amber-500/5 border border-amber-800/30 rounded-full px-2 py-0.5 font-korean">
                    {item.category}
                  </span>
                )}
                <SourceBadge url={item.url} date={item.date} />
              </div>
            ))
          )}
        </div>
      </AccordionSection>

      {/* Section 4: Uncertainties & Risks */}
      <AccordionSection
        sectionId="uncertainties"
        icon={AlertTriangle}
        title={t('uncertaintiesTitle', lang)}
        subtitle={t('uncertaintiesSub', lang)}
        defaultOpen
      >
        <div className="space-y-3">
          {result.uncertainties.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 hover:border-amber-800/40 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-sm text-zinc-200 leading-relaxed font-korean">{item.risk}</p>
              </div>
              {item.impact && (
                <div className="ml-6.5 pl-1 mt-2 flex items-start gap-2">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500/50 mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-500 leading-relaxed font-korean">{item.impact}</p>
                </div>
              )}
              <SourceBadge url={item.url} date={item.date} />
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Section 5: Tech Trends & Market Impact */}
      <AccordionSection
        sectionId="tech-trends"
        icon={TrendingUp}
        title={t('techTrendsTitle', lang)}
        subtitle={t('techTrendsSub', lang)}
        defaultOpen
      >
        <div className="space-y-5">
          {result.techTrends.summaryHasEvidence && result.techTrends.summary && (
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4">
              <p className="text-xs text-zinc-500 mb-1.5 font-korean flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400/70" />
                {t('trendSummary', lang)}
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed font-korean">{result.techTrends.summary}</p>
            </div>
          )}
          {!result.techTrends.summaryHasEvidence && (
            <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/20 p-4 text-center">
              <p className="text-xs text-zinc-600 font-korean">{t('trendSummaryNoEvidence', lang)}</p>
            </div>
          )}

          <div className="space-y-2.5">
            {result.techTrends.trends.map((item, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/20 p-3 animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}
              >
                <div className="shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-md bg-emerald-500/10 border border-emerald-700/20 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-200 leading-relaxed font-korean mb-1">{item.trend}</p>
                  {item.relevance && (
                    <p className="text-xs text-zinc-500 leading-relaxed font-korean">{item.relevance}</p>
                  )}
                  <SourceBadge url={item.url} date={item.date} />
                </div>
              </div>
            ))}
          </div>

          {result.techTrends.marketImpactHasEvidence && result.techTrends.marketImpact && (
            <div className="rounded-xl border border-emerald-800/30 bg-emerald-950/20 p-4">
              <p className="text-xs text-emerald-400/70 mb-1.5 font-korean flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {t('marketImpact', lang)}
              </p>
              <p className="text-sm text-zinc-200 leading-relaxed font-korean">{result.techTrends.marketImpact}</p>
            </div>
          )}
          {!result.techTrends.marketImpactHasEvidence && (
            <div className="rounded-xl border border-zinc-800/40 bg-zinc-900/20 p-4 text-center">
              <p className="text-xs text-zinc-600 font-korean">{t('marketImpactNoEvidence', lang)}</p>
            </div>
          )}

          {result.techTrends.glossary.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white tracking-tight">Tech Glossary</h4>
                <span className="text-[11px] text-zinc-500 font-korean">{t('techGlossary', lang)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.techTrends.glossary.map((entry, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 hover:border-emerald-800/40 transition-colors animate-fade-in-up stagger-${Math.min(i + 1, 3)}`}
                  >
                    <div className="flex items-baseline gap-2 mb-1.5">
                      <span className="text-sm font-bold text-emerald-300 font-korean">{entry.term}</span>
                      <span className="text-[10px] text-zinc-600 font-mono">{entry.english}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed font-korean">{entry.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </AccordionSection>

      {/* Sources */}
      {result.sources && result.sources.length > 0 && <SourcesSection sources={result.sources} lang={lang} />}

      {/* Diagnostics Panel */}
      {result.diagnostics && <DiagnosticsPanel diagnostics={result.diagnostics} lang={lang} langPath={result._langPath} translatedFields={result._translatedFields} langError={result._langError} />}
        </>
      )}
      {/* Disclaimer */}
      <div className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/30 px-4 py-3 animate-fade-in-up">
        <AlertCircle className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
        <p className="text-[11px] text-zinc-500 leading-relaxed font-korean">{t('disclaimer', lang)}</p>
      </div>
    </div>
  );
}

// ─── Company Overview & CEO Card ───

function CompanyOverviewCard({ result, lang }: { result: ScanResult; lang: Lang }) {
  const hasOverview = result.companyOverview && result.companyOverview.statement && result.companyOverview.statement.trim().length > 0;
  const hasCeo = result.ceoInfo && result.ceoInfo.statement && result.ceoInfo.statement.trim().length > 0;
  const isBlocked = result.companyPage === 'blocked' && result.companyDomainConfirmed;
  if (!hasOverview && !hasCeo && !isBlocked) return null;

  const sourceTypeStyles: Record<string, string> = {
    '공시·규제': 'bg-blue-500/15 text-blue-400 border-blue-800/30',
    '독립': 'bg-emerald-500/15 text-emerald-400 border-emerald-800/30',
    '회사 자체': 'bg-amber-500/15 text-amber-400 border-amber-800/30',
  };

  const renderSourceBadge = (item: SourceClaim) => {
    if (!item.sourceType) return <SourceBadge url={item.url} date={item.date} />;
    return (
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {item.isCompanyClaim && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-amber-500/15 text-amber-400 border-amber-800/30 font-korean">
            {t('srcCompanyClaim', lang)}
          </span>
        )}
        {item.sourceType.split(', ').map((st) => (
          <span key={st} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-korean ${sourceTypeStyles[st] || 'bg-zinc-700/30 text-zinc-500 border-zinc-700/40'}`}>
            {labelValue(st, SOURCE_TYPE_KEY, lang)}
          </span>
        ))}
        <SourceBadge url={item.url} date={item.date} />
      </div>
    );
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up stagger-1">
      {isBlocked && (
        <div className="px-5 py-3 border-b border-amber-800/30 bg-amber-500/5 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-300 font-korean">{t('companyBlocked', lang)}</p>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {hasOverview && (
          <div className="lg:col-span-2 p-5 lg:border-r border-zinc-800/60">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">Company Overview</h3>
              <span className="text-[11px] text-zinc-500 font-korean">{t('companyOverview', lang)}</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed font-korean">
              {result.companyOverview.statement}
            </p>
            {renderSourceBadge(result.companyOverview)}
          </div>
        )}

        {hasCeo && (
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">CEO</h3>
              <span className="text-[11px] text-zinc-500 font-korean">{t('ceoLabel', lang)}</span>
            </div>
            <p className="text-sm font-semibold text-emerald-300 mb-1.5 font-korean">
              {result.ceoInfo.statement}
            </p>
            {renderSourceBadge(result.ceoInfo)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Overall Score Section ───

function OverallScoreSection({ result, lang }: { result: ScanResult; lang: Lang }) {
  const { score, grade, rationale, rangeText, isHold, evidenceCount, totalSignals } = result.overallScore;

  const scoreColor = isHold ? 'text-amber-400' : score >= 4.5 ? 'text-emerald-400' : score >= 3.5 ? 'text-emerald-300' : score >= 2.5 ? 'text-amber-400' : 'text-red-400';
  const gradeBg = isHold ? 'bg-amber-500/15 border-amber-800/40 text-amber-300' : score >= 4.5 ? 'bg-emerald-500/15 border-emerald-700/40 text-emerald-300' : score >= 3.5 ? 'bg-emerald-500/10 border-emerald-800/30 text-emerald-300' : score >= 2.5 ? 'bg-amber-500/10 border-amber-800/30 text-amber-300' : 'bg-red-500/10 border-red-800/30 text-red-300';

  const pillars = [
    { label: t('pillarTiming', lang), key: 'marketTiming', data: result.marketTiming, icon: TrendingUp },
    { label: t('pillarMoat', lang), key: 'productMoat', data: result.productMoat, icon: ShieldCheck },
    { label: t('pillarExecution', lang), key: 'executionTraction', data: result.executionTraction, icon: Gauge },
    { label: t('pillarRisk', lang), key: 'riskControl', data: result.riskControl, icon: AlertTriangle },
  ] as const;

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up stagger-2">
      <div className="flex items-center gap-3 border-b border-zinc-800/80 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center">
          <Gauge className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white tracking-tight">Overall Score</h3>
          <p className="text-[11px] text-zinc-500 font-korean">{t('overallScoreTitle', lang)}</p>
        </div>
      </div>

      <div className="p-5">
        {/* Score + Grade + Range */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`w-5 h-5 ${!isHold && n <= Math.round(score) ? 'text-emerald-400 fill-emerald-400' : 'text-zinc-700'}`}
                />
              ))}
            </div>
            <span className={`text-3xl font-bold font-mono ${scoreColor}`}>
              {isHold ? '—' : score.toFixed(1)}
            </span>
          </div>
          {!isHold && grade && (
            <div className={`rounded-xl border px-4 py-2 ${gradeBg}`}>
              <span className="text-2xl font-bold font-mono">{grade}</span>
            </div>
          )}
          {/* Range Score */}
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-2">
            <Scale className="w-4 h-4 text-emerald-400/70" />
            <div>
              <p className="text-[10px] text-zinc-600 font-korean">{t('rangeScore', lang)}</p>
              <p className={`text-xs font-mono font-semibold ${isHold ? 'text-amber-400' : 'text-emerald-300'}`}>
                {displayOverallRangeText(rangeText, isHold, lang)}
              </p>
            </div>
          </div>
          {/* Evidence coverage */}
          <div className="flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/40 px-3 py-2">
            <BarChart3 className="w-4 h-4 text-emerald-400/70" />
            <div>
              <p className="text-[10px] text-zinc-600 font-korean">{t('evidenceCoverage', lang)}</p>
              <p className="text-xs font-mono font-semibold text-zinc-300">
                {evidenceCount}/{totalSignals}
              </p>
            </div>
          </div>
        </div>

        {/* 4-Pillar breakdown with signals */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.key} pillar={pillar} index={i} lang={lang} />
          ))}
        </div>

        {/* Rationale */}
        {rationale && (
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3">
            <p className="text-xs text-zinc-500 mb-1 font-korean">{t('rationale', lang)}</p>
            <p className="text-sm text-zinc-300 leading-relaxed font-korean">{displayRationale(rationale, isHold, lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Pillar Card with Signal Breakdown ───

function displayRangeText(rangeText: string, isHold: boolean, lang: Lang): string {
  if (isHold) return t('tmplHoldPillarRange', lang);
  // Non-hold: format is "X.X ~ Y.Y (근거 확보 N/M)"
  const match = rangeText.match(/^([\d.]+)\s*~\s*([\d.]+)\s*\(.*?(\d+)\/(\d+)\)$/);
  if (match) {
    return `${match[1]} ~ ${match[2]} (${t('tmplEvidenceRatio', lang)} ${match[3]}/${match[4]})`;
  }
  return rangeText;
}

function displayOverallRangeText(rangeText: string, isHold: boolean, lang: Lang): string {
  if (isHold) return t('tmplHoldRange', lang);
  const match = rangeText.match(/^([\d.]+)\s*~\s*([\d.]+)\s*\(.*?(\d+)\/(\d+)\)$/);
  if (match) {
    return `${match[1]} ~ ${match[2]} (${t('tmplEvidenceRatio', lang)} ${match[3]}/${match[4]})`;
  }
  return rangeText;
}

function displayRationale(rationale: string, isHold: boolean, lang: Lang): string {
  if (isHold) {
    // Format: "평가 보류 (근거 부족) — 보류된 축: 시장 & 타이밍, 제품 & 해자"
    // Extract pillar names after the dash and translate them
    const dashIdx = rationale.indexOf('—');
    if (dashIdx >= 0) {
      const pillarPart = rationale.slice(dashIdx + 1).trim();
      // Try to extract pillar names — they match known Korean pillar labels
      const pillarLabelMap: Record<string, StringKey> = {
        '시장 & 타이밍': 'pillarTiming',
        '제품 & 해자': 'pillarMoat',
        '실행 & 트랙션': 'pillarExecution',
        '리스크 관리': 'pillarRisk',
      };
      let translated = pillarPart;
      for (const [koName, key] of Object.entries(pillarLabelMap)) {
        translated = translated.replace(koName, t(key, lang));
      }
      // Replace the prefix "보류된 축:" with translated version
      const colonIdx = translated.indexOf(':');
      if (colonIdx >= 0) {
        const afterColon = translated.slice(colonIdx + 1);
        translated = `${t('tmplHeldPillars', lang)}:${afterColon}`;
      }
      return `${t('tmplHoldRationale', lang)} — ${translated}`;
    }
    return t('tmplHoldRationale', lang);
  }
  // Non-hold: "4-pillar 종합 점수 (근거 확보 N/M)"
  const match = rationale.match(/\(.*?(\d+)\/(\d+)\)/);
  if (match) {
    return `${t('tmplScoreSummary', lang)} (${t('tmplEvidenceRatio', lang)} ${match[1]}/${match[2]})`;
  }
  return rationale;
}

function PillarCard({ pillar, index, lang }: { pillar: { label: string; data: PillarScore; icon: React.ComponentType<{ className?: string }> }; index: number; lang: Lang }) {
  const { score, rangeText, isHold, evidenceCount, totalSignals, signals } = pillar.data;
  const scoreColor = isHold ? 'text-amber-400' : score >= 4.5 ? 'text-emerald-400' : score >= 3.5 ? 'text-emerald-300' : score >= 2.5 ? 'text-amber-400' : 'text-red-400';
  const barColor = isHold ? 'from-amber-500 to-amber-400' : score >= 4.5 ? 'from-emerald-500 to-emerald-400' : score >= 3.5 ? 'from-emerald-600 to-emerald-500' : score >= 2.5 ? 'from-amber-500 to-amber-400' : 'from-red-500 to-red-400';
  const barWidth = isHold ? 0 : (score / 5) * 100;

  return (
    <div className={`rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 animate-fade-in-up stagger-${Math.min(index + 1, 3)}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-700/20 flex items-center justify-center">
            <pillar.icon className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-zinc-300 font-korean">{pillar.label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-lg font-bold font-mono ${scoreColor}`}>
            {isHold ? t('holdLabel', lang) : score.toFixed(1)}
          </span>
          {!isHold && <span className="text-[10px] text-zinc-600 font-mono">/ 5.0</span>}
        </div>
      </div>

      {/* Score bar */}
      <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden mb-2">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-500`}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      {/* Range text */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-mono ${isHold ? 'text-amber-400/80' : 'text-emerald-400/70'}`}>
          {displayRangeText(rangeText, isHold, lang)}
        </span>
      </div>

      {/* Signal breakdown */}
      <div className="space-y-2">
        {signals.map((sig) => (
          <SignalRow key={sig.id} signal={sig} lang={lang} />
        ))}
      </div>
    </div>
  );
}

// ─── Signal Row ───

function SignalRow({ signal, lang }: { signal: SignalResult; lang: Lang }) {
  const [expanded, setExpanded] = useState(false);
  const judgmentStyles: Record<string, string> = {
    '좋음': 'bg-emerald-500/15 text-emerald-400 border-emerald-800/30',
    '보통': 'bg-amber-500/15 text-amber-400 border-amber-800/30',
    '나쁨': 'bg-red-500/15 text-red-400 border-red-800/30',
    '알 수 없음': 'bg-zinc-700/30 text-zinc-500 border-zinc-700/40',
  };
  const evidenceStyles: Record<string, string> = {
    '강함': 'text-emerald-400',
    '보통': 'text-amber-400',
    '약함': 'text-orange-400',
    '없음': 'text-zinc-600',
  };
  const sourceTypeStyles: Record<string, string> = {
    '공시·규제': 'bg-blue-500/15 text-blue-400 border-blue-800/30',
    '독립': 'bg-emerald-500/15 text-emerald-400 border-emerald-800/30',
    '회사 자체': 'bg-amber-500/15 text-amber-400 border-amber-800/30',
  };

  return (
    <div className="rounded-lg border border-zinc-800/40 bg-zinc-900/20 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-zinc-900/40 transition-colors"
      >
        <span className="text-[10px] font-mono text-zinc-600 shrink-0">{signal.id}</span>
        <span className="text-xs text-zinc-300 font-korean flex-1 text-left truncate">{signalName(signal.id, lang)}</span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${judgmentStyles[signal.judgment] || judgmentStyles['알 수 없음']}`}>
          {labelValue(signal.judgment, JUDGMENT_KEY, lang)}
        </span>
        <span className={`text-[9px] font-bold shrink-0 ${evidenceStyles[signal.evidence] || evidenceStyles['없음']}`}>
          {labelValue(signal.evidence, EVIDENCE_KEY, lang)}
        </span>
        <ChevronDown className={`w-3 h-3 text-zinc-600 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 pt-1 space-y-2 animate-fade-in">
          {/* Criteria */}
          <div className="flex items-start gap-1.5">
            <HelpCircle className="w-3 h-3 text-zinc-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-zinc-600 leading-relaxed font-korean">{signal.criteria}</p>
          </div>
          {/* Reasoning */}
          {signal.reasoning && (
            <div className="flex items-start gap-1.5">
              <FileText className="w-3 h-3 text-emerald-400/50 mt-0.5 shrink-0" />
              <p className="text-[10px] text-zinc-400 leading-relaxed font-korean">{signal.reasoning}</p>
            </div>
          )}
          {/* Source type badge */}
          {signal.sourceType && (
            <div className="flex flex-wrap items-center gap-1.5">
              {signal.sourceType.split(', ').map((st) => (
                <span key={st} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border font-korean ${sourceTypeStyles[st] || 'bg-zinc-700/30 text-zinc-500 border-zinc-700/40'}`}>
                  {labelValue(st, SOURCE_TYPE_KEY, lang)}
                </span>
              ))}
            </div>
          )}
          {/* Source */}
          <SourceBadge url={signal.url} date={signal.date} />
          {/* Signal diagnostics */}
          {signal.diagnostics && (
            <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-mono mt-1">
              <span>chunk_ids: LLM {signal.diagnostics.llmChunkIds}</span>
              <span className="text-red-400/60">→ {t('deletedLabel', lang)} {signal.diagnostics.invalidChunkIds}</span>
              {(signal.diagnostics.invalidSignalMismatch ?? 0) > 0 && <span className="text-orange-400/60">{t('signalMismatch', lang)} {signal.diagnostics.invalidSignalMismatch}</span>}
              {(signal.diagnostics.invalidNameMismatch ?? 0) > 0 && <span className="text-amber-400/60">{t('nameMismatch', lang)} {signal.diagnostics.invalidNameMismatch}</span>}
              {(signal.diagnostics.invalidNonExistent ?? 0) > 0 && <span className="text-red-500/60">{t('nonExistent', lang)} {signal.diagnostics.invalidNonExistent}</span>}
              <span className="text-emerald-400/60">→ {t('passedLabel', lang)} {signal.diagnostics.finalChunkIds}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Source Badge ───

function SourceBadge({ url, date }: { url: string; date: string }) {
  const hasUrl = url && url.trim().length > 0 && url !== '확인된 정보 없음' && url !== '날짜 없음' && url !== '출처 없음';
  const hasDate = date && date.trim().length > 0 && date !== '확인된 정보 없음' && date !== '날짜 없음' && date !== '출처 없음';
  if (!hasUrl && !hasDate) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {hasUrl && (
        <a
          href={url.startsWith('http') ? url : `https://${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-emerald-400/80 hover:text-emerald-300 transition-colors font-mono"
        >
          <ExternalLink className="w-3 h-3 shrink-0" />
          {url.replace(/^https?:\/\//, '').replace(/^www\./, '').slice(0, 35)}
        </a>
      )}
      {hasDate && (
        <span className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
          <Clock className="w-2.5 h-2.5" />
          {date}
        </span>
      )}
    </div>
  );
}

// ─── Sources Section ───

function SourcesSection({ sources, lang }: { sources: string[]; lang: Lang }) {
  return (
    <div className="glass-card p-5 animate-fade-in-up stagger-3">
      <div className="flex items-center gap-2 mb-3">
        <Link2 className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-white tracking-tight">Sources</h3>
        <span className="text-[11px] text-zinc-500 font-korean">{t('sourcesTitle', lang)}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, i) => {
          const isUrl = src.startsWith('http');
          const display = isUrl ? src.replace(/^https?:\/\//, '').replace(/^www\./, '').slice(0, 40) : src;
          return (
            <a
              key={i}
              href={isUrl ? src : `https://${src}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 hover:text-emerald-300 hover:border-emerald-700/50 transition-all font-mono"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {display}
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Accordion Section ───

function AccordionSection({
  sectionId,
  icon: Icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  sectionId: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up stagger-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-900/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-700/30 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
          <p className="text-[11px] text-zinc-500 font-korean">{subtitle}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-800/60 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Badges ───

// ─── Diagnostics Panel ───

function DiagnosticsPanel({ diagnostics, lang, langPath, translatedFields, langError }: { diagnostics: DiagnosticsType; lang: Lang; langPath?: string; translatedFields?: string[]; langError?: string }) {
  const [open, setOpen] = useState(false);
  const pillarLabels: Record<string, string> = {
    marketTiming: t('pillarTiming', lang),
    productMoat: t('pillarMoat', lang),
    executionTraction: t('pillarExecution', lang),
    riskControl: t('pillarRisk', lang),
  };

  return (
    <div className="glass-card overflow-hidden animate-fade-in-up stagger-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-900/30 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-zinc-500/10 border border-zinc-700/30 flex items-center justify-center shrink-0">
          <Terminal className="w-4 h-4 text-zinc-400" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="text-sm font-bold text-white tracking-tight">Diagnostics</h3>
          <p className="text-[11px] text-zinc-500 font-korean">{t('diagnosticsTitle', lang)}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-zinc-800/60 animate-fade-in space-y-4">
          {/* Global stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('pagesScraped', lang)}</p>
              <p className="text-lg font-bold font-mono text-zinc-300">{diagnostics.pagesScraped}</p>
            </div>
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('totalChunks', lang)}</p>
              <p className="text-lg font-bold font-mono text-zinc-300">{diagnostics.totalChunks}</p>
            </div>
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('searchCalls', lang)}</p>
              <p className="text-lg font-bold font-mono text-zinc-300">{diagnostics.totalSearchCalls ?? 0}</p>
            </div>
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('searchDuration', lang)}</p>
              <p className="text-lg font-bold font-mono text-zinc-300">{((diagnostics.searchDurationMs ?? 0) / 1000).toFixed(1)}s</p>
            </div>
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('skippedSignals', lang)}</p>
              <p className="text-lg font-bold font-mono text-zinc-300">{(diagnostics.skippedSignals ?? []).length}</p>
            </div>
          </div>

          {/* Language path */}
          {langPath && (
            <div className="rounded-lg border border-zinc-800/60 bg-zinc-900/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] text-zinc-600 font-korean">{t('langPathLabel', lang)}:</p>
                <span className="text-[10px] font-mono text-emerald-400/80 rounded border border-emerald-800/30 bg-emerald-950/20 px-2 py-0.5">
                  {langPath === 'stored_en' ? t('langPathStoredEn', lang) :
                   langPath === 'translated_from_ko' ? t('langPathTranslatedFromKo', lang) :
                   langPath === 'ko_fallback' ? t('langPathKoFallback', lang) :
                   langPath === 'fresh_scan' ? t('langPathFreshScan', lang) :
                   langPath === 'stored_ko' ? t('langPathStoredKo', lang) : langPath}
                </span>
                {translatedFields && translatedFields.length > 0 && (
                  <div className="flex flex-wrap gap-1 ml-2">
                    <span className="text-[10px] text-zinc-600 font-korean">{t('translatedFieldsLabel', lang)}:</span>
                    {translatedFields.map((f) => (
                      <span key={f} className="text-[9px] font-mono text-blue-400/70 rounded border border-blue-800/30 px-1.5 py-0.5">{f}</span>
                    ))}
                  </div>
                )}
                {langError && (
                  <span className="text-[10px] text-red-400/70 font-mono ml-2">{t('langErrorLabel', lang)}: {langError}</span>
                )}
              </div>
            </div>
          )}

          {/* Search failure summary */}
          {diagnostics.searchFailureSummary && diagnostics.searchFailureSummary.attempted > 0 && (
            <div className={`rounded-lg border p-3 ${diagnostics.searchFailureSummary.failureRate >= 0.5 ? 'border-red-800/40 bg-red-950/20' : 'border-amber-800/30 bg-amber-950/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${diagnostics.searchFailureSummary.failureRate >= 0.5 ? 'text-red-400' : 'text-amber-400'}`} />
                <p className={`text-[11px] font-korean ${diagnostics.searchFailureSummary.failureRate >= 0.5 ? 'text-red-300' : 'text-amber-300'}`}>
                  {t('searchFailure', lang)}: {diagnostics.searchFailureSummary.failed} / {diagnostics.searchFailureSummary.attempted} ({t('failureRate', lang)} {Math.round(diagnostics.searchFailureSummary.failureRate * 100)}%)
                </p>
              </div>
              {diagnostics.searchFailureSummary.representativeError && (
                <p className="text-[10px] font-mono text-zinc-500 ml-6">
                  {t('representativeError', lang)}: {diagnostics.searchFailureSummary.representativeError}
                </p>
              )}
              {Object.keys(diagnostics.searchFailureSummary.errorBreakdown).length > 0 && (
                <div className="flex flex-wrap gap-1.5 ml-6 mt-2">
                  {Object.entries(diagnostics.searchFailureSummary.errorBreakdown).map(([err, cnt]) => (
                    <span key={err} className="text-[9px] font-mono text-red-400/80 rounded border border-red-800/30 px-1.5 py-0.5">
                      {err}: {cnt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* LLM finish reason warning */}
          {diagnostics.llmFinishReason === 'length' && (
            <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-[11px] text-amber-300 font-korean">{t('llmTruncated', lang)}</p>
            </div>
          )}

          {/* Skipped signals */}
          {(diagnostics.skippedSignals ?? []).length > 0 && (
            <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-3">
              <p className="text-[10px] text-amber-400 font-korean mb-1">{t('skippedByLimit', lang)}</p>
              <div className="flex flex-wrap gap-1.5">
                {diagnostics.skippedSignals.map((sid) => (
                  <span key={sid} className="text-[10px] font-mono text-amber-400/80 rounded border border-amber-800/30 px-1.5 py-0.5">
                    {sid}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Per-signal search diagnostics */}
          {diagnostics.signalSearch && Object.keys(diagnostics.signalSearch).length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 font-korean mb-2">{t('perSignalSearch', lang)}</p>
              <div className="space-y-3">
                {Object.entries(diagnostics.signalSearch).map(([pillarKey, sigs]) => (
                  <div key={pillarKey}>
                    <p className="text-[11px] text-zinc-500 font-korean mb-1.5">{pillarLabels[pillarKey] || pillarKey}</p>
                    <div className="space-y-1.5">
                      {sigs.map((sd, i) => (
                        <div key={i} className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-zinc-600 rounded border border-zinc-800/40 bg-zinc-900/20 px-2 py-1">
                          {sd.skipped ? (
                            <span className="text-amber-400/70">#{i + 1} {t('skippedLabel', lang)}</span>
                          ) : (
                            <>
                              <span className="text-zinc-500">#{i + 1}</span>
                              <span className="text-zinc-400 truncate max-w-[200px]">{sd.query}</span>
                              <span className="text-blue-400/60">{t('resultLabel', lang)}: {sd.resultCount}</span>
                              <span className="text-emerald-400/60">{t('scrapedLabel', lang)}: {sd.scrapedPages}</span>
                              {sd.errorType && (
                                <span className="text-red-400/70">
                                  {t('errorLabel', lang)}: {sd.errorType}{sd.errorStatus ? ` (${sd.errorStatus})` : ''}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company domains */}
          {diagnostics.companyDomains && diagnostics.companyDomains.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 font-korean mb-2">{t('confirmedDomains', lang)}</p>
              <div className="flex flex-wrap gap-2">
                {diagnostics.companyDomains.map((d) => (
                  <span key={d} className="text-[10px] font-mono text-emerald-400/80 rounded-lg border border-emerald-800/30 bg-emerald-950/20 px-2 py-1">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Existence check */}
          {diagnostics.existenceCheck && (
            <div>
              <p className="text-[10px] text-zinc-600 font-korean mb-2">{t('existenceCheck', lang)}</p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono">
                <span className={`rounded border px-2 py-0.5 ${diagnostics.existenceCheck.passed ? 'border-emerald-800/30 bg-emerald-950/20 text-emerald-400/80' : 'border-red-800/30 bg-red-950/20 text-red-400/80'}`}>
                  {diagnostics.existenceCheck.passed ? t('passed', lang) : t('failed', lang)}
                </span>
                <span className="text-zinc-500">{t('homepageLabel', lang)}: {diagnostics.existenceCheck.homepageOk ? t('okLabel', lang) : t('noneLabel', lang)}</span>
                <span className="text-zinc-500">{t('nameMatchDomains', lang)}: {diagnostics.existenceCheck.nameMatchedDomains.length}</span>
                {diagnostics.existenceCheck.nameMatchedDomains.length > 0 && (
                  <span className="text-zinc-400">{diagnostics.existenceCheck.nameMatchedDomains.join(', ')}</span>
                )}
              </div>
            </div>
          )}

          {/* Domain counts */}
          <div>
            <p className="text-[10px] text-zinc-600 font-korean mb-2">{t('domainChunkCounts', lang)}</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(diagnostics.domainCounts).map(([domain, count]) => {
                const dType = diagnostics.domainTypes?.[domain] || '';
                const typeColor = dType === '회사 자체' ? 'text-amber-400/70 border-amber-800/30' : dType === '공시·규제' ? 'text-blue-400/70 border-blue-800/30' : dType === '독립' ? 'text-emerald-400/70 border-emerald-800/30' : '';
                return (
                  <span key={domain} className={`text-[10px] font-mono text-zinc-400 rounded-lg border border-zinc-800 bg-zinc-900/50 px-2 py-1`}>
                    {domain}: {count}
                    {dType && <span className={`ml-1.5 px-1 rounded border ${typeColor}`}>{labelValue(dType, SOURCE_TYPE_KEY, lang)}</span>}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Page text lengths */}
          <div>
            <p className="text-[10px] text-zinc-600 font-korean mb-1">{t('pageTextLengths', lang)}</p>
            <p className="text-[10px] font-mono text-zinc-400">{diagnostics.pageTextLengths.join(', ')} chars</p>
          </div>

          {/* Per-signal chunk validation */}
          <div>
            <p className="text-[10px] text-zinc-600 font-korean mb-2">{t('perSignalChunk', lang)}</p>
            <div className="space-y-3">
              {Object.entries(diagnostics.signalDiagnostics).map(([pillarKey, sigs]) => (
                <div key={pillarKey}>
                  <p className="text-[11px] text-zinc-500 font-korean mb-1.5">{pillarLabels[pillarKey] || pillarKey}</p>
                  <div className="space-y-1">
                    {sigs.map((sd, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-zinc-600">
                        <span className="text-zinc-500 w-8">#{i + 1}</span>
                        <span>LLM: {sd.llmChunkIds}</span>
                        <span className="text-red-400/60">{t('deletedLabel', lang)}: {sd.invalidChunkIds}</span>
                        {(sd.invalidSignalMismatch ?? 0) > 0 && <span className="text-orange-400/60">{t('signalMismatch', lang)}: {sd.invalidSignalMismatch}</span>}
                        {(sd.invalidNameMismatch ?? 0) > 0 && <span className="text-amber-400/60">{t('nameMismatch', lang)}: {sd.invalidNameMismatch}</span>}
                        {(sd.invalidNonExistent ?? 0) > 0 && <span className="text-red-500/60">{t('nonExistent', lang)}: {sd.invalidNonExistent}</span>}
                        <span className="text-emerald-400/60">{t('passedLabel', lang)}: {sd.finalChunkIds}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
