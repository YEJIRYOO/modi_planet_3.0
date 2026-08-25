// MODI Planet LMS — 교육과정 카탈로그. 서버 조회, 레벨 목록, 과정 화면.

import { LEVELS, MODES } from "./config.js";
import { asList, escapeHtml, main } from "./dom.js";
import { getActiveCatalog, getCatalog, getLevelMeta, lessonKey, state } from "./state.js";

export async function fetchCatalog(levelId) {
  const response = await fetch("/api/v3/curriculum/" + encodeURIComponent(levelId), {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(levelId + " 교육과정을 불러오지 못했습니다. (" + response.status + ")");
  }
  const catalog = await response.json();
  if (!catalog || !Array.isArray(catalog.lessons) || catalog.lessons.length !== 9) {
    throw new Error(levelId + " 교육과정 데이터가 올바르지 않습니다.");
  }
  state.catalogs.set(levelId, catalog);
  return catalog;
}

export function updateProductRail() {
  const classroomActive = window.location.hash === "#classroom";
  const classroomLink = document.querySelector(".classroom-nav-link");
  const curriculumLink = document.querySelector('.rail-nav a[href="/lms"]');
  if (classroomLink) {
    classroomLink.classList.toggle("active", classroomActive);
    classroomLink.toggleAttribute("aria-current", classroomActive);
  }
  if (curriculumLink) {
    curriculumLink.classList.toggle("active", !classroomActive);
    curriculumLink.toggleAttribute("aria-current", !classroomActive);
  }
  document.querySelectorAll("[data-rail-level]").forEach((link) => {
    const active = link.dataset.railLevel === state.levelId;
    link.classList.toggle("active", active);
    if (active) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

export function renderLevelIndex() {
  const catalogs = LEVELS.map((level) => getCatalog(level.id));
  const totalLessons = catalogs.reduce((sum, catalog) => sum + catalog.lessons.length, 0);
  const totalTime = catalogs.reduce((sum, catalog) => sum + catalog.classMinutes * catalog.lessons.length, 0);
  const standards = new Set(catalogs.flatMap((catalog) => catalog.lessons.flatMap((lesson) => (
    asList(lesson.standards).map((standard) => standard.code)
  ))));

  main.innerHTML = [
    '<div class="page-container">',
    '<section class="catalog-hero" aria-labelledby="catalogTitle">',
    '<div class="hero-copy">',
    '<p class="hero-badge">2022 개정 교육과정 연계</p>',
    '<h1 id="catalogTitle">배우고, 만들고,<br><em>MODI로 움직여요.</em></h1>',
    '<p>초급부터 고급까지 학교급에 맞춘 27차시 프로젝트 수업입니다. Web, 하드웨어, Web+하드웨어를 난이도별로 차근차근 완성합니다.</p>',
    '<div class="hero-actions"><button class="hero-action" type="button" data-level="elementary">초급부터 시작 <span>→</span></button>',
    '<a class="hero-action light" href="https://modiplanet.com/learning-space" target="_blank" rel="noreferrer">공식 Learning Space</a></div>',
    "</div>",
    '<div class="hero-visual" aria-hidden="true"><div class="hero-course-stack">',
    catalogs.map((catalog, index) => [
      '<div class="hero-course-card"><img src="/static/assets/brand/',
      escapeHtml(LEVELS[index].thumbnail), '" alt=""><strong>',
      escapeHtml(LEVELS[index].difficulty), " · ", escapeHtml(catalog.label), " ", escapeHtml(catalog.subject),
      "</strong></div>"
    ].join("")).join(""),
    "</div></div>",
    "</section>",
    '<section class="stat-strip" aria-label="전체 교육과정 요약">',
    '<div class="stat-item"><strong>3단계</strong><span>초급 · 중급 · 고급</span></div>',
    '<div class="stat-item"><strong>', String(totalLessons), '차시</strong><span>학교급별 9차시</span></div>',
    '<div class="stat-item"><strong>3가지</strong><span>Web · H/W · 융합</span></div>',
    '<div class="stat-item"><strong>', String(totalTime), '분</strong><span>전체 수업 시간</span></div>',
    "</section>",
    '<section class="level-section" aria-labelledby="levelTitle">',
    '<header class="section-heading"><div><p class="section-kicker">Curriculum</p><h2 id="levelTitle">난이도를 선택하세요</h2></div>',
    '<p>각 단계는 Web 3차시, 하드웨어 3차시, Web+하드웨어 프로젝트 3차시로 구성됩니다.</p></header>',
    '<div class="level-grid">',
    catalogs.map((catalog, index) => renderLevelCard(catalog, LEVELS[index])).join(""),
    "</div>",
    '<p class="sr-only">연계 성취기준 ', String(standards.size), "개</p>",
    "</section></div>"
  ].join("");

  document.title = "교육과정 · MODI Planet";
}

export function renderLevelCard(catalog, levelMeta) {
  const completed = catalog.lessons.filter((lesson) => state.progress[lessonKey(catalog.level, lesson.no)]).length;
  return [
    '<button class="level-card" type="button" data-level="', escapeHtml(catalog.level), '">',
    '<div class="level-thumb"><span class="difficulty">', escapeHtml(levelMeta.difficulty), '</span><img src="/static/assets/brand/',
    escapeHtml(levelMeta.thumbnail), '" alt=""></div>',
    '<div class="level-content"><div class="level-meta"><span>', escapeHtml(catalog.grade), "</span><span>",
    escapeHtml(catalog.subject), "</span><span>", String(catalog.classMinutes), "분</span></div>",
    "<h3>", escapeHtml(catalog.label), " 교육과정 · 9차시</h3>",
    "<p>", escapeHtml(catalog.overview), "</p>",
    '<div class="level-footer"><span>', completed ? "완료 " + completed + "/9차시" : "9차시 전체 보기", "</span><b>→</b></div>",
    "</div></button>"
  ].join("");
}

export function renderCourse() {
  const catalog = getActiveCatalog();
  const levelMeta = getLevelMeta(catalog.level);
  const groups = ["web", "hw", "webhw"].map((mode) => ({
    mode,
    lessons: catalog.lessons.filter((lesson) => lesson.projectType === mode)
  })).filter((group) => state.modeFilter === "all" || group.mode === state.modeFilter);

  main.innerHTML = [
    '<div class="catalog-layout">',
    '<section class="course-main">',
    renderCompactLevelNav(catalog.level),
    '<nav class="breadcrumb" aria-label="현재 위치"><button type="button" data-action="all-levels">교육과정</button><span>›</span><span>',
    escapeHtml(levelMeta.difficulty), " · ", escapeHtml(catalog.label), "</span></nav>",
    '<header class="course-header"><div><p class="course-kicker">', escapeHtml(levelMeta.difficulty), " Curriculum</p>",
    "<h1>", escapeHtml(catalog.label), " ", escapeHtml(catalog.subject), '<br><span>9차시 프로젝트 수업</span></h1>',
    '<p class="course-overview">', escapeHtml(catalog.overview), "</p>",
    '<div class="course-badges"><span>', escapeHtml(catalog.grade), "</span><span>차시당 ", String(catalog.classMinutes),
    "분</span><span>Web 3</span><span>하드웨어 3</span><span>융합 3</span></div></div></header>",
    '<aside class="curriculum-note"><strong>교과 연계 안내</strong><span>', escapeHtml(catalog.curriculumNote),
    catalog.standardsSource && catalog.standardsSource.url ? ' <a href="' + escapeHtml(catalog.standardsSource.url) + '" target="_blank" rel="noreferrer">교육부 고시 원문 보기</a>' : "",
    "</span></aside>",
    renderModeTabs(),
    '<div class="lesson-groups">', groups.map((group) => renderLessonGroup(group, catalog)).join(""), "</div>",
    "</section></div>"
  ].join("");

  document.title = catalog.label + " 교육과정 · MODI Planet";
}

export function renderCompactLevelNav(activeLevelId) {
  return [
    '<nav class="compact-level-nav" aria-label="난이도 선택">',
    LEVELS.map((meta) => {
      const catalog = getCatalog(meta.id);
      const active = meta.id === activeLevelId;
      return [
        '<a class="', active ? "active" : "", '" href="/lms#', escapeHtml(meta.id), '"',
        active ? ' aria-current="page"' : "", ">", escapeHtml(meta.difficulty), " · ", escapeHtml(catalog.label), "</a>"
      ].join("");
    }).join(""),
    "</nav>"
  ].join("");
}

export function renderModeTabs() {
  const tabs = [
    { id: "all", label: "전체 9차시" },
    { id: "web", label: "Web · 1~3차시" },
    { id: "hw", label: "하드웨어 · 4~6차시" },
    { id: "webhw", label: "Web + 하드웨어 · 7~9차시" }
  ];
  return [
    '<div class="mode-tabs" role="group" aria-label="수업 유형 필터">',
    tabs.map((tab) => [
      '<button type="button" data-mode-filter="', tab.id, '" class="', state.modeFilter === tab.id ? "active" : "",
      '" aria-pressed="', state.modeFilter === tab.id ? "true" : "false", '">', tab.label, "</button>"
    ].join("")).join(""),
    "</div>"
  ].join("");
}

export function renderLessonGroup(group, catalog) {
  const mode = MODES[group.mode];
  const description = group.mode === "web"
    ? "브라우저에서 실행되는 개별 작품을 차시마다 완성합니다."
    : group.mode === "hw"
      ? "MODI 센서와 출력 모듈을 연결해 개별 장치를 완성합니다."
      : catalog.finalGoal;
  return [
    '<section class="lesson-group" aria-labelledby="group-', group.mode, '"><header class="lesson-group-header"><h2 id="group-', group.mode,
    '">', escapeHtml(mode.range), " · ", escapeHtml(mode.long), "</h2><p>", escapeHtml(description), "</p></header>",
    '<div class="lesson-grid">', group.lessons.map((lesson) => renderLessonCard(lesson, catalog)).join(""), "</div></section>"
  ].join("");
}

export function renderLessonCard(lesson, catalog) {
  const mode = MODES[lesson.projectType] || MODES.web;
  const completed = Boolean(state.progress[lessonKey(catalog.level, lesson.no)]);
  return [
    '<article class="lesson-card"><div class="lesson-topline"><span class="lesson-number">',
    String(lesson.no).padStart(2, "0"), completed ? '<span class="completion-mark" aria-label="완료">✓</span>' : "", '</span><span class="mode-chip ', escapeHtml(lesson.projectType), '">',
    escapeHtml(mode.label), "</span></div><h3>", escapeHtml(lesson.title), "</h3><p>", escapeHtml(lesson.summary), "</p>",
    '<div class="standard-list">', asList(lesson.standards).map((standard) => (
      '<span class="standard-chip">' + escapeHtml(standard.code) + "</span>"
    )).join(""), '<span class="deck-chip">', String(asList(lesson.slides).length), "페이지 · 교실 실행형</span></div>",
    '<div class="lesson-actions"><button class="open-plan" type="button" data-plan-lesson="', String(lesson.no),
    '">교안 보기</button><button class="start-lesson" type="button" data-start-lesson="', String(lesson.no),
    '">', completed ? "다시 수업" : "수업 시작", "</button></div></article>"
  ].join("");
}
