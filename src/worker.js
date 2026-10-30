// 포트폴리오 쇼케이스 Worker.
// 정적 파일(public/)은 ASSETS 바인딩이 그대로 서빙하고,
// /api/status 만 서버측에서 대신 Render 서비스를 호출해 실제 상태 코드를 확인해 돌려준다.
// (브라우저에서 직접 호출하면 CORS 때문에 opaque 응답만 받아 200/502를 구분할 수 없다.)

const ALLOWED_TARGETS = new Set([
  "https://air-agent-b5s1.onrender.com",
  "https://corp-agent.onrender.com/",
  "https://realty-agent-01ar.onrender.com/",
  "https://stat-agent.onrender.com",
  "https://trend-agent-3ld5.onrender.com",
  "https://startup-sector-classifier.onrender.com",
  "https://nsmc-sentiment-classifier.onrender.com",
  "https://korea-data-mcp.onrender.com",
]);

const STATUS_TIMEOUT_MS = 20_000;

async function checkStatus(target) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), STATUS_TIMEOUT_MS);
  try {
    const resp = await fetch(target, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      cf: { cacheTtl: 0, cacheEverything: false },
    });
    return { ok: resp.ok, status: resp.status };
  } catch (err) {
    return { ok: false, error: String(err && err.message ? err.message : err) };
  } finally {
    clearTimeout(timer);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/status") {
      const target = url.searchParams.get("url") || "";
      if (!ALLOWED_TARGETS.has(target)) {
        return Response.json({ ok: false, error: "허용되지 않은 URL" }, { status: 400 });
      }
      const result = await checkStatus(target);
      return Response.json(result, {
        headers: { "cache-control": "no-store" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
