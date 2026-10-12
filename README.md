# AlphaScout

AlphaScout analyzes companies from a venture capitalist's point of view, and it shows no score when the evidence is not enough.

**Live:** https://venture-capital-tech-ida1.bolt.host

> Automatically generated analysis, not investment advice. Reflects information as of the analysis time.

## What it does

Enter a company name. The app gathers evidence through web search, then evaluates 20 fixed signals (5 in each of 4 pillars) and produces a score.

## Why not just ask GPT or Claude?

A general chatbot can give an answer even when it has only a few signals to go on. AlphaScout does not. It checks every company with the same 20 signals under the same rules. If there is not enough evidence, it shows "on hold" instead of a score.

## How it works

- **The score is calculated by code.** The LLM (gpt-4o-mini) only *judges* whether each signal is supported by the evidence. The scoring itself is done by deterministic code.
- **No evidence, no score.** If no evidence is found, the signal is marked "cannot verify" or "evaluation on hold". If one pillar is on hold, the overall result is on hold too (a held pillar is not dropped from the average).
- **Search:** Tavily Search API
- **Stack:** Bolt frontend + Supabase Edge Function (`scan-trend`) + Supabase DB
- **Saved results:** Stored per company and language and can be reopened. After 7 days a result gets an "outdated result" badge.
- **Languages:** Korean / English (`?lang=en`)

## How to use it

- **View saved results:** No API key needed.
- **Analyze a new company:** You need your own OpenAI API key (used for the judging step). I pay for the search, so there is a daily limit on new analyses.

## Known limitations

- Search results differ between runs, so scores can vary.
- Companies with little evidence come out as "evaluation on hold" (observed, for example, in Tesla's Execution pillar).
- A company-owned domain (for example, a subdomain) can be misclassified as an "independent source".
- Low-reliability sources (such as social media posts) are sometimes used as evidence.
- An analysis takes 30 to 50 seconds.
- I built this project with Bolt and AI tools. The decisions below were mine.

## Decisions I made

- **Code calculates the score; the LLM only judges.** I designed it to integrate information gathered by live web search. If the LLM also handled scoring, it would sometimes give a judgment even when the evidence is insufficient.
- **No evidence means no score: the result is shown as "on hold".** A score without evidence makes the reliability of the result uncertain.
- **Visitors bring their own key, and new analyses are limited to 3 per day.** My own API token budget is not enough to cover more.

## Author

Seoyoung Park

## Feedback

Please open an Issue or write to parkseyoung1215@gmail.com.

[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-3ouzwkat)
