// MODI Planet LMS — 해시 라우팅과 부팅.

import { fetchCatalog, renderCourse, renderLevelIndex, updateProductRail } from "./catalog.js";
import { renderClassroom } from "./classroom.js";
import { LEVELS } from "./config.js";
import { escapeHtml, main } from "./dom.js";
import { dismissLessonPlayer } from "./player.js";
import { state } from "./state.js";

const LOADING_HTML = '<div id="appLoading" class="app-loading" role="status"><span class="loader" aria-hidden="true"></span><strong>교육과정을 불러오고 있어요</strong></div>';

// 적재 "중"인 요청만 공유한다. 끝나면 비우고 이후 판단은 항상 state.catalogs 로 한다.
// 완료된 프라미스를 붙들면 카탈로그가 비어 있는데도 즉시 resolve 되어, route() 가
// 스스로를 다시 부르는 마이크로태스크 무한 루프(렌더러 정지)가 된다.
let catalogsPromise = null;

function catalogsReady() {
  return LEVELS.every((level) => state.catalogs.has(level.id));
}

function loadCatalogs() {
  if (!catalogsPromise) {
    const missing = LEVELS.filter((level) => !state.catalogs.has(level.id));
    catalogsPromise = Promise.all(missing.map((level) => fetchCatalog(level.id)))
      .finally(() => { catalogsPromise = null; });
  }
  return catalogsPromise;
}

function renderCatalogError(error) {
  const message = error && error.message ? error.message : String(error);
  main.innerHTML = [
    '<section class="error-state">',
    "<h1>교육과정을 불러오지 못했어요</h1>",
    "<p>", escapeHtml(message), "</p>",
    '<button class="primary-button" type="button" data-action="retry">다시 시도</button>',
    "</section>"
  ].join("");
}

function finishRoute() {
  updateProductRail();
  window.scrollTo({ top: 0, behavior: "auto" });
  main.focus({ preventScroll: true });
}

// 카탈로그가 준비된 뒤의 교육과정 화면 렌더링. 여기서는 다시 적재하지 않는다.
function renderCurriculum(raw) {
  const requested = LEVELS.some((level) => level.id === raw) ? raw : null;
  if (requested) {
    state.levelId = requested;
    state.modeFilter = "all";
    renderCourse();
  } else {
    state.levelId = null;
    renderLevelIndex();
  }
  finishRoute();
}

export function route() {
  if (state.activeLesson) {
    dismissLessonPlayer();
  }
  const raw = window.location.hash.replace(/^#/, "");
  // 나의 교실은 로컬 상태만 쓴다. 교육과정 API 가 느리거나 죽어도 여기서 끝나므로
  // /lms#classroom 이 초기 로딩 표시에 갇히지 않는다.
  if (raw === "classroom") {
    state.levelId = null;
    renderClassroom();
    finishRoute();
    return;
  }
  // 레벨 인덱스와 코스 화면은 둘 다 세 레벨 카탈로그를 모두 읽는다. #classroom 으로
  // 진입했다면 아직 비어 있으므로, 교육과정으로 넘어오는 이 시점에 채운다.
  if (!catalogsReady()) {
    main.innerHTML = LOADING_HTML;
    loadCatalogs().then(() => {
      // 적재 중 해시가 바뀌었으면 최신 해시로 다시 판단한다.
      const current = window.location.hash.replace(/^#/, "");
      if (current === "classroom") {
        route();
      } else if (catalogsReady()) {
        renderCurriculum(current);
      } else {
        renderCatalogError(new Error("교육과정 데이터를 불러오지 못했습니다."));
      }
    }, renderCatalogError);
    return;
  }
  renderCurriculum(raw);
}

export function boot() {
  route();
}
