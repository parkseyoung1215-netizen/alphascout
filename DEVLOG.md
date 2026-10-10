# AlphaScout Dev Log

## 1. Why I built this

I am very interested in venture capital, but I am still a student. I wanted to learn how a venture capitalist looks at a company and judges it. I thought this kind of judgment should be systematic and follow clear rules.

a16z is one of the largest venture capital firms, so I was curious about their way of thinking. I asked an AI to help me design an evaluation in that style, and I turned it into 20 fixed signals in 4 pillars: market and timing, product and moat, execution and traction, and risk. I have not checked these against a published a16z document, so they are my own interpretation, not an official a16z rule.

I wondered: if I combine a venture capitalist's way of thinking with an AI's analysis, could the result be cold and accurate? I built AlphaScout to try this and to learn a new point of view.

## 2. Entries

### Sep 28 - 29

- What I did: I started AlphaScout on Bolt late on Sep 28 (first saved version at 11:30 PM). In the first hour I connected OpenAI GPT-4o-mini for the analysis. On Sep 29 I added URL input with validation and error handling, a fact-check breakdown on the page, and fixed JSON parsing and scraping.
- Note: On Sep 29 I fixed URL validation three times and JSON parsing and scraping once, according to my Bolt version history.
### Sep 30

- What I did: I changed the search so it accepts keywords and company names, not only URLs.

### Oct 1

- What I did: I switched the framework to a16z's 4 pillars, added company overview and CEO info, and refactored the edge function to scrape the web in real time instead of relying on the AI's own knowledge.

### Oct 1 – 2 (scoring engine)
- What I did: I made the code calculate the scores. The AI (gpt-4o-mini) only judges whether each signal is supported by evidence.
- Where I got stuck: If the AI is allowed to calculate the score too, it can make up a score from its own opinion even when evidence is missing. I saw this many times in my early tests.
- My decision and why: I chose to let the code calculate the score, so the AI cannot invent a score without evidence. When the code calculates the score, the evidence and sources can be shown next to it, which makes the result easier to trust.
- Result: When I ran the analysis again, the scores stayed within a small range (an error range). The scores can still change a little, because the search results are different each time.
  
### Oct 3

- What I did: I replaced the DuckDuckGo scraping with Tavily search, and fixed a bug in the score calculation.
- Where I got stuck: Big companies like Meta and Tesla could not be searched because of firewalls. My first test on nvidia found evidence for only 3 of 20 signals.
- Result: After switching to Tavily, nvidia went from 3/20 to 15/20 signals with evidence (61 pages, 221 chunks, 34.7 seconds for 20 searches). But almost every signal came back "good" and the overall score was 5.0 A+, so I rewrote the judging criteria. After that: nvidia 4.5, harmonicai 4.2, tavus had one pillar withheld for lack of evidence, and a company that does not exist was not analyzed.
- Late that night I changed how the company is identified, so Tesla could be analyzed (3.4 B-, evidence 11/20).


### Oct 4

- What I did: I limited how many chunks each signal could use and updated the scraping and OpenAI logic.
- Where I got stuck: When I limited how many chunks each signal could use, Tesla's evidence dropped from 11/20 to 6/20 and the overall score was withheld.
- My guess: The AI cited chunks without knowing which signal's search they came from, so the limit rule deleted them.

### Oct 5

- What I did: I ran the same company many times, read the diagnostics, and fixed what I found.
- Where I got stuck: The same Tesla input gave 6/20 once and 11/20 another time. Diagnostics showed six signals were cited and then deleted (mt3, mt5, pm2, pm4, et1, et2). After the fix, repeated runs stayed within about 0.2 (tesla 3.9 / 3.8 / 4.0 / 3.8 / 3.8, nvidia 4.2 / 4.0 / 4.0 / 4.0).
- Result: Around 5 AM I added saving results. The first run of a company does the full analysis. Running it again returns the saved result in about 1 second, with a "run new analysis" button. I counted this as the first complete version.
- Also added: key check before searching, request limits per IP, blocking internal addresses, response size limit, a daily limit of 20 analyses, and a health check that costs no search credits. I also added internationalization (i18n) support and translation in the edge function.

## 3. Problems I found and what I did

- Problem: tavus got 4.3 with range 4.3 to 4.3, and I read it as "all 20 signals have evidence".
  How I noticed: I suspected the company domain was wrong (the app used tavus.ai, the real site is tavus.io), but typing tavus.io directly gave the same 4.3.
  What I changed: My reading was wrong. One pillar (risk) was withheld with 1 of 5 evidence, so 4.3 was only the average of the other three pillars. I changed how withheld pillars are handled and capped signals that rely on low-quality sources (aggregators, press releases, social media).

- Problem: A company that does not exist (tellasd) did not return "cannot verify".
  How I noticed: Diagnostics showed 100 pages and 324 chunks, but no domain with the name tellasd. Tesla pages were mixed in, so the search probably read the typo as a similar company.
  What I changed: A source only counts as evidence if the company name appears in it. The first version checked this per chunk and was too strict (Tesla lost a whole pillar), so I relaxed it to per page. After that, Tesla showed 19/20 evidence and 0 deleted.

- Problem: Updates broke the app several times.
  How I noticed: Every input failed with "Failed to fetch". The causes were a renamed function parameter that was still used under the old name, then a variable declared twice (the server could not start at all).
  What I changed: Fixed both, then added the health check and a server status indicator on the page so I can see a broken deploy without spending search credits.

## 4. Mentor feedback
- Who (role only):
- What I heard:
- What I changed:
- What happened after:

## 5. Not done yet / next steps
- Get feedback from a few people (VC / startup / developers) before changing more.
- Check scores against companies I know well (about 10: big companies, growing startups, failed companies).
- Search credits are the bottleneck (Tavily free plan). I plan to apply for the student plan.
- New analyses need the user's own OpenAI key. Saved results can be viewed without a key.
- The 20 signals are my own interpretation of a16z's way of thinking, not an official rule (see section 1).
- Next experiment: a test entrance where fake pages go in without search, to measure how the system reacts to bad evidence.
