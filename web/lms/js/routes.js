// MODI Planet LMS — 해시 라우팅과 부팅.

import { fetchCatalog, renderCourse, renderLevelIndex, updateProductRail } from "./catalog.js";
import { renderClassroom } from "./classroom.js";
import { LEVELS } from "./config.js";
import { escapeHtml, main } from "./dom.js";
import { dismissLessonPlayer } from "./player.js";
import { state } from "./state.js";

export async function boot() {
  try {
    await Promise.all(LEVELS.map((level) => fetchCatalog(level.id)));
    route();
  } catch (error) {
    main.innerHTML = [
      '<section class="error-state">',
      "<h1>교육과정을 불러오지 못했어요</h1>",
      "<p>", escapeHtml(error.message), "</p>",
      '<button class="primary-button" type="button" data-action="retry">다시 시도</button>',
      "</section>"
    ].join("");
  }
}

export function route() {
  if (state.activeLesson) {
    dismissLessonPlayer();
  }
  const raw = window.location.hash.replace(/^#/, "");
  if (raw === "classroom") {
    state.levelId = null;
    renderClassroom();
    updateProductRail();
    window.scrollTo({ top: 0, behavior: "auto" });
    main.focus({ preventScroll: true });
    return;
  }
  const requested = LEVELS.some((level) => level.id === raw) ? raw : null;
  if (requested) {
    state.levelId = requested;
    state.modeFilter = "all";
    renderCourse();
  } else {
    state.levelId = null;
    renderLevelIndex();
  }
  updateProductRail();
  window.scrollTo({ top: 0, behavior: "auto" });
  main.focus({ preventScroll: true });
}
