// Render 무료 플랜 프로젝트는 15분 미접속 시 슬립 상태로 들어간다.
// 브라우저에서 각 서비스를 직접 fetch하면 CORS 때문에 opaque 응답만 받아
// 200(준비됨)과 502(깨어나는 중)를 구분할 수 없다. 그래서 같은 출처인
// 이 Worker의 /api/status를 통해 서버측에서 대신 확인한다.

const POLL_INTERVAL_MS = 4_000;
const MAX_ATTEMPTS = 20; // 약 80초까지 재시도

async function checkOnce(target) {
  const res = await fetch(`/api/status?url=${encodeURIComponent(target)}`, { cache: "no-store" });
  if (!res.ok) return { ok: false };
  return res.json();
}

async function wake(el, attempt = 1) {
  const target = el.dataset.wakeUrl;
  el.textContent = "깨우는 중…";
  el.className = "badge checking";

  let result;
  try {
    result = await checkOnce(target);
  } catch {
    result = { ok: false };
  }

  if (result.ok) {
    el.textContent = "준비 완료";
    el.className = "badge live";
    el.onclick = null;
    el.removeAttribute("role");
    return;
  }

  if (attempt >= MAX_ATTEMPTS) {
    el.textContent = "응답 없음 · 다시 시도";
    el.className = "badge error";
    el.setAttribute("role", "button");
    el.onclick = () => wake(el, 1);
    return;
  }

  setTimeout(() => wake(el, attempt + 1), POLL_INTERVAL_MS);
}

document.querySelectorAll(".badge[data-wake-url]").forEach((el) => wake(el));

// 작동 예시: 잠든 서버를 기다리지 않아도 실제 실행 화면을 바로 볼 수 있게 한다.
const dialog = document.getElementById("demo-dialog");
const dialogImg = dialog.querySelector(".demo-body img");
const DEFAULT_FOOT = dialog.querySelector(".demo-foot").textContent;

document.querySelectorAll("[data-demo]").forEach((el) => {
  el.addEventListener("click", () => {
    const article = el.closest("article");
    const name = article ? article.querySelector("h3").textContent : "";
    dialog.querySelector(".demo-title").textContent = `${name} 작동 예시`;
    dialog.querySelector(".demo-q").textContent = `입력: ${el.dataset.q}`;
    dialog.querySelector(".demo-foot").textContent = el.dataset.foot || DEFAULT_FOOT;
    dialogImg.src = el.dataset.demo;
    dialogImg.alt = `${name} 실행 화면`;
    dialog.querySelector(".demo-body").scrollTop = 0;
    dialog.showModal();
  });
});

dialog.querySelector(".demo-close").addEventListener("click", () => dialog.close());
// 바깥(backdrop) 클릭으로 닫기
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
