// Render 무료 플랜 프로젝트는 15분 미접속 시 슬립 상태로 들어간다.
// 페이지가 열리면 각 서비스에 조용히 요청을 보내 깨우고, 응답이 오면 배지를 "준비 완료"로 바꾼다.
// CORS 응답을 읽을 수는 없어 상태 코드는 모르지만(no-cors), 요청이 끝났다는 것 자체가
// "서버가 지금 응답하고 있다 = 깨어났다"는 신호로는 충분하다.

const WAKE_TIMEOUT_MS = 70_000;

async function wake(el) {
  const url = el.dataset.wakeUrl;
  el.textContent = "깨우는 중…";
  el.className = "badge checking";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WAKE_TIMEOUT_MS);

  try {
    await fetch(url, { mode: "no-cors", cache: "no-store", signal: controller.signal });
    el.textContent = "준비 완료";
    el.className = "badge live";
    el.removeAttribute("role");
    el.onclick = null;
  } catch {
    el.textContent = "응답 없음 · 다시 시도";
    el.className = "badge error";
    el.setAttribute("role", "button");
    el.onclick = () => wake(el);
  } finally {
    clearTimeout(timer);
  }
}

document.querySelectorAll(".badge[data-wake-url]").forEach((el) => wake(el));
