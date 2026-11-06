# showcase

장호열이 만든 AI 에이전트를 한곳에서 직접 써 볼 수 있는 포트폴리오 사이트

👉 **https://showcase.hoyeol.workers.dev/**

## 들어 있는 것

| 프로젝트 | 한 줄 |
| --- | --- |
| [inhouse-data-agent](https://github.com/janghoyeol/inhouse-data-agent) | 가상 회사 사내 데이터 에이전트 — 권한 안에서만 SQL·규정으로 답하고, 환불은 제안만 |
| [korea-data-mcp](https://github.com/janghoyeol/korea-data-mcp) | 공공데이터 에이전트 4개의 도구 16개를 MCP 서버 하나로 |
| [trend-agent](https://github.com/janghoyeol/trend-agent) | 검색어 급등 원인을 기사와 함께 설명 |
| [nsmc-sentiment-classifier](https://github.com/janghoyeol/nsmc-sentiment-classifier) | 처음부터 학습한 영화 리뷰 감성 분류 모델 |
| 공공데이터 에이전트 | 통계·공시·대기질·실거래가 |

## 구조

- `public/` 정적 페이지 (카드 목록·작동 예시 팝업)
- `src/worker.js` Cloudflare Worker — `/api/status`가 각 데모(Render 무료, 잠들면 느림)를 서버에서 대신 호출해 깨우고 상태를 알려 줌. 호출할 수 있는 주소는 허용 목록으로 제한

배포: Cloudflare Workers (`wrangler.toml`), main에 푸시하면 배포
