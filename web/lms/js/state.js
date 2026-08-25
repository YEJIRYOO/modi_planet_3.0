// MODI Planet LMS — 런타임 상태, 진도 저장소, 카탈로그 조회.

import { LEVELS, PROGRESS_KEY, USER_KEY } from "./config.js";

export function loadProgress() {
  try {
    const data = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
    return data && typeof data === "object" ? data : {};
  } catch (_error) {
    return {};
  }
}

export function loadUserId() {
  const stored = window.localStorage.getItem(USER_KEY);
  if (stored) {
    return stored;
  }
  const id = "u-" + Math.random().toString(36).slice(2, 12);
  window.localStorage.setItem(USER_KEY, id);
  return id;
}

export function saveProgress() {
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(state.progress));
  } catch (_error) {
    // Progress still works for this page view if local storage is unavailable.
  }
}

export const state = {
  catalogs: new Map(),
  levelId: null,
  modeFilter: "all",
  activeLesson: null,
  planLesson: null,
  slideIndex: 0,
  studioTab: "activity",
  previewSource: "preset",
  previewDemoActive: false,
  studioOpen: false,
  teacherNoteOpen: false,
  quizAnswers: {},
  checklistAnswers: {},
  lessonStartedAt: 0,
  timerId: null,
  chatMessages: [],
  files: {},
  blocklyXml: "",
  modiModules: [],
  streaming: false,
  abortController: null,
  progress: loadProgress(),
  userId: loadUserId()
};

export function lessonKey(levelId, lessonNo) {
  return levelId + "-" + String(lessonNo).padStart(2, "0");
}

export function getLevelMeta(id) {
  return LEVELS.find((level) => level.id === id) || LEVELS[0];
}

export function getCatalog(id) {
  return state.catalogs.get(id);
}

export function getActiveCatalog() {
  return state.levelId ? getCatalog(state.levelId) : null;
}

export function findLesson(number) {
  const catalog = getActiveCatalog();
  return catalog ? catalog.lessons.find((lesson) => Number(lesson.no) === Number(number)) : null;
}
