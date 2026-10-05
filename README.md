# alphascout
# AlphaScout

VC 관점에서 기업·기술을 분석하는 AI 웹사이트입니다.
An AI web app that analyzes companies and technologies from a venture-capital perspective.

**Live:** https://venture-capital-tech-ida1.bolt.host

> 자동 생성된 분석이며 투자 조언이 아닙니다. 분석 시각 기준 정보입니다.
> Automatically generated analysis, not investment advice. Reflects information as of the analysis time.

## 무엇을 하나요
회사 이름을 입력하면 웹 검색으로 근거를 모으고, 4개 영역(pillar)에서 고정 신호 20개(영역당 5개)를 평가해 점수를 냅니다.

## 작동 방식
- **점수는 코드가 계산합니다.** LLM(gpt-4o-mini)은 각 신호가 근거로 뒷받침되는지 "판단"만 하고, 점수 계산은 코드가 결정적으로 합니다.
- **근거가 없으면 점수를 만들지 않습니다.** 근거를 찾지 못하면 "확인 불가"나 "평가 보류"로 표시합니다. 한 영역이 보류면 전체 결과도 보류입니다(보류 영역을 빼고 평균내지 않습니다).
- **검색:** Tavily Search API
- **구성:** Bolt 프론트엔드 + Supabase Edge Function(`scan-trend`) + Supabase DB
- **결과 저장:** 회사·언어별로 저장되고 다시 열 수 있습니다. 7일이 지나면 "오래된 결과" 배지가 붙습니다.
- **언어:** 한국어 / English (`?lang=en`)

## 사용 방법
- **저장된 결과 보기:** API 키 없이 열람할 수 있습니다.
- **새 회사 분석:** 방문자 본인의 OpenAI API 키가 필요합니다(판단 단계에 사용). 검색 비용은 운영자가 부담하므로 하루 새 분석 횟수에 한도가 있습니다.

## 알려진 한계
- 검색 결과가 실행마다 달라져 점수가 흔들릴 수 있습니다.
- 근거가 부족한 회사는 "평가 보류"로 나옵니다(예: Tesla의 Execution 영역에서 관찰됨).
- 회사 소유 도메인(예: 서브도메인)을 "독립 출처"로 잘못 분류할 수 있습니다.
- 신뢰도가 낮은 출처(SNS 글 등)가 근거로 쓰이는 경우가 있습니다.
- 분석 시간이 30~50초 걸립니다.
- 이 프로젝트는 Bolt와 AI 도구로 구현했습니다. 아래 항목은 제가 직접 결정했습니다.

## 직접 결정한 것
## 직접 결정한 것
- **점수는 코드가 계산하고, LLM은 판단만 합니다.** 실시간 웹 검색으로 모은 정보를 통합해 평가하도록 설계했습니다. LLM이 점수까지 맡으면 근거가 부족한 상황에서도 판단을 내리는 경우가 생기기 때문입니다.
- **근거가 없으면 점수를 내지 않고 "보류"로 표시합니다.** 근거 없이 점수를 내면 결과의 신뢰도가 불확실해지기 때문입니다.
- **방문자 키 방식과 하루 새 분석 3회 한도를 두었습니다.** 제가 가진 API 토큰 한도가 부족하기 때문입니다.

## 만든 사람
박세영 (Seoyoung Park)

## 피드백
이슈(Issues)나 아래로 알려 주세요: (parkseyoung1215@gmail.com)
[![Open in Bolt](https://bolt.new/static/open-in-bolt.svg)](https://bolt.new/~/sb1-3ouzwkat)
