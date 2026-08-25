// MODI Planet LMS — 슬라이드 비주얼. 15개 슬라이드 문법 × 27개 차시 장면.

import { LESSON_SCENE_PROFILES, MODES, MODULE_VISUAL_MATCHES, PREVIEW_PRESETS, SLIDE_VISUAL_META, WORLD_PROFILES } from "./config.js";
import { asList, escapeHtml } from "./dom.js";
import { getLevelMeta, lessonKey } from "./state.js";

export function shortenVisualText(value, limit) {
  const text = String(value == null ? "" : value).replace(/\s+/g, " ").trim();
  const max = Number(limit) || 54;
  return text.length > max ? text.slice(0, Math.max(1, max - 1)).trim() + "…" : text;
}

export function visualValue(value) {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  return String(value.term || value.criterion || value.symptom || value.fix || value.title || value.label || "");
}

export function resolveSlideModule(slide, lesson) {
  const slideSource = [slide.title, slide.question, asList(slide.body).join(" "), asList(slide.instructions).join(" ")].join(" ").toLowerCase();
  const directMatch = MODULE_VISUAL_MATCHES.find((candidate) => candidate.words.some((word) => slideSource.includes(word.toLowerCase())));
  if (directMatch) {
    return directMatch;
  }
  const materialSource = asList(lesson.materials).join(" ").toLowerCase();
  return MODULE_VISUAL_MATCHES.find((candidate) => candidate.words.some((word) => materialSource.includes(word.toLowerCase()))) || null;
}

export function resolveLessonVisualAsset(levelId, lesson, slide) {
  const module = resolveSlideModule(slide, lesson);
  if (lesson.projectType === "web") {
    return {
      file: "/static/assets/brand/" + getLevelMeta(levelId).thumbnail,
      alt: getLevelMeta(levelId).difficulty + " Web 프로젝트 미리보기",
      kind: "web"
    };
  }
  if (module && ["build", "concept", "example"].includes(slide.type)) {
    return {
      file: "/static/assets/lesson-visuals/" + module.file,
      alt: "MODI " + module.label + " 모듈",
      kind: "module",
      moduleLabel: module.label
    };
  }
  if (lesson.projectType === "hw") {
    let file = "modi-kit-flatlay.jpg";
    if ((levelId === "middle" && lesson.no === 4) || (levelId === "high" && lesson.no === 5)) {
      file = "modi-smart-farm.jpg";
    } else if ((levelId === "middle" && lesson.no === 5) || (levelId === "high" && lesson.no === 4)) {
      file = "modi-car-robot.jpg";
    } else if (slide.type === "title" || slide.type === "hook") {
      file = "modi-ecosystem.jpg";
    }
    return { file: "/static/assets/lesson-visuals/" + file, alt: "MODI 프로젝트 제품 구성", kind: "photo" };
  }
  if (levelId === "elementary") {
    return { file: "/static/assets/lesson-visuals/modi-car-robot.jpg", alt: "MODI 탐사차 프로젝트 장면", kind: "photo" };
  }
  if (levelId === "middle") {
    return { file: "/static/assets/lesson-visuals/modi-control-workspace.jpg", alt: "웹 화면과 MODI 장치를 함께 제어하는 장면", kind: "photo" };
  }
  return { file: "/static/assets/lesson-visuals/web-modi-hybrid.png", alt: "웹 관제 화면과 장치 사이의 양방향 데이터 흐름", kind: "cutout" };
}

export function getLessonSceneProfile(levelId, lesson) {
  return LESSON_SCENE_PROFILES[lessonKey(levelId, lesson.no)] || {
    kind: "showcase",
    code: "MODI LAB",
    title: lesson.title,
    subtitle: lesson.summary,
    tokens: ["INPUT", "LOGIC", "OUTPUT"],
    route: 0
  };
}

export function getVisualTextList(values, limit, fallback) {
  const list = asList(values).map((value) => shortenVisualText(visualValue(value), 58)).filter(Boolean);
  if (list.length) {
    return list.slice(0, Number(limit) || 3);
  }
  return asList(fallback).slice(0, Number(limit) || 3);
}

export function renderSceneTokenRail(profile) {
  return '<div class="scene-token-rail">' + asList(profile.tokens).slice(0, 3).map((token, index) => (
    '<span><i>' + String(index + 1).padStart(2, "0") + '</i><b>' + escapeHtml(token) + '</b></span>'
  )).join("") + "</div>";
}

export function renderLessonScene(ctx, variant) {
  const profile = ctx.profile;
  const tokens = asList(profile.tokens);
  const t0 = escapeHtml(tokens[0] || "INPUT");
  const t1 = escapeHtml(tokens[1] || "LOGIC");
  const t2 = escapeHtml(tokens[2] || "OUTPUT");
  let scene = "";

  if (profile.kind === "profile") {
    scene = '<div class="scene-profile-card"><span class="scene-avatar">해</span><b>햇살의 카드</b><small>그림 · 우주 · 고양이</small></div><div class="scene-privacy-shield"><i>0</i><b>개인정보</b></div>';
  } else if (profile.kind === "ordered-page") {
    scene = '<div class="scene-page-stack"><span><i>01</i>반 이름</span><span><i>02</i>급훈</span><span><i>03</i>우리 반 자랑</span></div><div class="scene-scroll-line"></div>';
  } else if (profile.kind === "random-wheel") {
    scene = '<div class="scene-fortune-wheel"><i></i><i></i><i></i><i></i><b>행운</b></div><div class="scene-trial-dots">' + Array.from({ length: 10 }, (_value, index) => '<i class="' + (index % 3 === 0 ? "hot" : "") + '"></i>').join("") + '</div>';
  } else if (profile.kind === "signal-chain") {
    scene = '<div class="scene-circuit"><span class="input">BUTTON</span><i></i><span class="logic">NETWORK</span><i></i><span class="output"><b></b><b></b><b></b>LED</span></div>';
  } else if (profile.kind === "distance-alarm") {
    scene = '<div class="scene-sensor"><i></i><i></i><i></i><b>ToF</b></div><div class="scene-distance-ruler"><span>0</span><b>20cm</b><span>42cm</span></div><div class="scene-vault">보물</div>';
  } else if (profile.kind === "dial-fan") {
    scene = '<div class="scene-dial"><i></i><b>62%</b></div><div class="scene-fan"><i></i><i></i><i></i><span></span></div><div class="scene-wind-lines"><i></i><i></i><i></i></div>';
  } else if (profile.kind === "rover-zone") {
    scene = '<div class="scene-crater"></div><div class="scene-rover"><b>M</b><i></i><i></i></div><div class="scene-sensor-cone"><i></i></div><span class="scene-stop-mark">SAFE STOP</span>';
  } else if (profile.kind === "remote-link") {
    scene = '<div class="scene-base-console"><b>BASE</b><span>↑</span><span>←</span><span>→</span></div><div class="scene-data-lanes"><i>COMMAND →</i><i>← 64cm</i></div><div class="scene-mini-rover"><b>M</b><i></i><i></i></div>';
  } else if (profile.kind === "showcase") {
    scene = '<div class="scene-stage"><div class="scene-stage-light left"></div><div class="scene-stage-light right"></div><b>STAR SCOUT</b><span>LIVE MISSION</span></div><div class="scene-run-sheet"><i>2:00</i><i>1:00</i><i>3/3</i></div>';
  } else if (profile.kind === "requirements-trace") {
    scene = '<div class="scene-trace"><span class="user">사용자</span><i></i><span class="requirement">요구사항</span><i></i><span class="screen">D-5</span></div><div class="scene-acceptance"><b>✓</b> 수용 기준 5/5</div>';
  } else if (profile.kind === "stopwatch-state") {
    scene = '<div class="scene-stopwatch"><b>00:05.20</b><span>LAP 03</span></div><div class="scene-state-loop"><i>READY</i><b>→</b><i>RUN</i><b>→</b><i>STOP</i></div>';
  } else if (profile.kind === "debug-trace") {
    scene = '<div class="scene-debug-before"><small>BEFORE</small><b>CLICK×2</b><span>2표</span></div><div class="scene-patch">LOCK</div><div class="scene-debug-after"><small>AFTER</small><b>CLICK×2</b><span>1표 · PASS</span></div>';
  } else if (profile.kind === "lux-threshold") {
    scene = '<div class="scene-lux-plot"><i style="--x:12%;--y:74%"></i><i style="--x:32%;--y:58%"></i><i style="--x:58%;--y:32%"></i><i style="--x:80%;--y:18%"></i><b>35 lx 기준</b></div><div class="scene-lamp"><i></i><span>LED ON</span></div>';
  } else if (profile.kind === "auto-door") {
    scene = '<div class="scene-door"><i></i><i></i><span>14cm</span></div><div class="scene-door-states"><b>OPEN</b><i>3s</i><b>WAIT</b><i>→</i><b>CLOSED</b></div>';
  } else if (profile.kind === "rhythm-wave") {
    scene = '<div class="scene-pads">' + ["KICK", "SNARE", "HAT", "FX"].map((label, index) => '<i class="p' + index + '">' + label + '</i>').join("") + '</div><div class="scene-wave">' + Array.from({ length: 12 }, (_value, index) => '<i style="--h:' + (18 + (index * 17) % 72) + '%"></i>').join("") + '</div>';
  } else if (profile.kind === "sensor-stage") {
    scene = '<div class="scene-rig"><i></i><i></i><i></i><span class="beam one"></span><span class="beam two"></span><b>NOVA LIVE</b></div><div class="scene-audience"><i></i><i></i><i></i></div>';
  } else if (profile.kind === "telemetry-console") {
    scene = '<div class="scene-console-screen"><b>LIVE</b><div>' + Array.from({ length: 8 }, (_value, index) => '<i style="--h:' + (24 + (index * 23) % 68) + '%"></i>').join("") + '</div><span>74 ms</span></div><span class="scene-estop">E-STOP</span>';
  } else if (profile.kind === "festival") {
    scene = '<div class="scene-festival-booths"><span>A<small>센서 무대</small></span><span>B<small>관제 콘솔</small></span><span>C<small>증거 전시</small></span></div><div class="scene-crowd">' + Array.from({ length: 7 }, () => "<i></i>").join("") + '</div>';
  } else if (profile.kind === "interval-collision") {
    scene = '<div class="scene-calendar"><span>09</span><span>10</span><span>11</span><i class="booking one">A</i><i class="booking two">B</i><b>OVERLAP</b></div>';
  } else if (profile.kind === "er-aggregate") {
    scene = '<div class="scene-erd"><span><b>MENU</b><i>menuId</i></span><em>1 : N</em><span><b>REVIEW</b><i>rating</i></span></div><div class="scene-aggregate">Σ ÷ n <b>4.0</b></div>';
  } else if (profile.kind === "journey-priority") {
    scene = '<div class="scene-journey"><span>발견</span><i class="pain">12s</i><span>시작</span><i>→</i><span>완료</span><b>5s</b></div><div class="scene-priority"><i>효과 ↑</i><b>NOW</b></div>';
  } else if (profile.kind === "timeseries-entry") {
    scene = '<div class="scene-timeseries"><span>110</span><i style="--x:8%;--y:18%"></i><i style="--x:28%;--y:72%"></i><i style="--x:45%;--y:76%"></i><i style="--x:62%;--y:70%"></i><i style="--x:84%;--y:16%"></i><b>ENTRY +1</b></div>';
  } else if (profile.kind === "hysteresis-band") {
    scene = '<div class="scene-hysteresis"><span class="on">29°C · FAN ON</span><div><i></i><b>상태 유지 구간</b></div><span class="off">27°C · FAN OFF</span></div>';
  } else if (profile.kind === "reaction-state") {
    scene = '<div class="scene-reaction-lights"><i></i><i></i><i class="ready"></i></div><div class="scene-reaction-wave"><span>WAIT</span><i></i><span>READY</span><b>0.211s</b></div>';
  } else if (profile.kind === "orbit-architecture") {
    scene = '<div class="scene-orbit"><span class="ship">SHIP</span><i class="orbit-ring one"></i><span class="network">NETWORK</span><i class="orbit-ring two"></i><span class="ops">OPS</span></div>';
  } else if (profile.kind === "mission-ops") {
    scene = '<div class="scene-spacecraft"><i></i><b>ORBIT-9</b></div><div class="scene-uplink"><span>COMMAND ↑</span><span>↓ TELEMETRY</span></div><div class="scene-mission-panels"><i>74ms</i><i>1,284pkt</i><i>E2E OK</i></div>';
  } else {
    scene = '<div class="scene-incident-chain"><span>REQ</span><i></i><span>FAIL</span><i></i><span>LOG</span><i></i><span>FIX</span><i></i><span>PASS</span></div><div class="scene-recovered">RECOVERED</div>';
  }

  return [
    '<div class="lesson-scene scene--', escapeHtml(profile.kind), ' scene-variant--', escapeHtml(variant || "standard"), '" role="img" aria-label="',
    escapeHtml(profile.title + " — " + profile.subtitle), '"><div class="lesson-scene-art">', scene, '</div>',
    variant === "compact" ? "" : renderSceneTokenRail(profile),
    '<span class="sr-only">', t0, " → ", t1, " → ", t2, "</span></div>"
  ].join("");
}

export function createSlideVisualContext(levelId, lesson, slide, slideIndex) {
  const profile = getLessonSceneProfile(levelId, lesson);
  return {
    levelId,
    lesson,
    slide,
    slideIndex,
    profile,
    preset: PREVIEW_PRESETS[lessonKey(levelId, lesson.no)] || {},
    asset: resolveLessonVisualAsset(levelId, lesson, slide),
    meta: SLIDE_VISUAL_META[slide.type] || { label: "VISUAL NOTE", layout: "mechanism-board" }
  };
}

export function renderVisualShell(ctx, body, options) {
  const settings = options || {};
  const layout = settings.layout || ctx.meta.layout;
  const buildKind = settings.buildKind || "";
  const layoutFingerprint = [layout, ctx.profile.kind, buildKind].filter(Boolean).join(":");
  return [
    '<figure class="lesson-slide-visual visual-layout--', escapeHtml(layout), " mode-", escapeHtml(ctx.lesson.projectType), " level-", escapeHtml(ctx.levelId),
    '" data-layout="', escapeHtml(layoutFingerprint), '" data-scene="', escapeHtml(ctx.profile.kind), '" data-scene-kind="', escapeHtml(ctx.profile.kind),
    '" data-lesson-key="', escapeHtml(lessonKey(ctx.levelId, ctx.lesson.no)), '" data-slide-type="', escapeHtml(ctx.slide.type), '" data-visual-level="', escapeHtml(ctx.levelId),
    '" data-visual-lesson="', String(ctx.lesson.no), '" data-visual-slide="', String(Number(ctx.slideIndex) + 1), '"',
    buildKind ? ' data-build-kind="' + escapeHtml(buildKind) + '"' : "", ">",
    '<div class="lesson-visual-topline"><span>', escapeHtml(ctx.meta.label), '</span><b>', escapeHtml(ctx.profile.code), '</b><small>', escapeHtml(ctx.profile.title), "</small></div>",
    '<div class="lesson-visual-stage" data-visual-body>', body, "</div>",
    '<figcaption><span>', escapeHtml(ctx.profile.code), '</span><b>', escapeHtml(shortenVisualText(ctx.slide.title, 72)),
    '</b><small>', escapeHtml(MODES[ctx.lesson.projectType].long), " · ", escapeHtml(WORLD_PROFILES[ctx.levelId].name), "</small></figcaption></figure>"
  ].join("");
}

export function renderAtmosphereAsset(ctx, className) {
  return '<img class="' + escapeHtml(className || "visual-atmosphere-image") + '" src="' + escapeHtml(ctx.asset.file) + '" alt="' + escapeHtml(ctx.asset.alt) + '">';
}

export function renderTitleVisual(ctx) {
  const artifacts = getVisualTextList(ctx.lesson.studentArtifacts, 2, ["완성 작품", "제작 근거"]);
  return [
    '<section class="visual-cinema"><div class="visual-cinema-backdrop">', renderAtmosphereAsset(ctx), '<div class="visual-cinema-shade"></div></div>',
    '<div class="visual-cinema-copy"><small>', escapeHtml(ctx.profile.code), '</small><strong>', escapeHtml(ctx.profile.title), '</strong><p>', escapeHtml(ctx.profile.subtitle), "</p></div>",
    '<div class="visual-cinema-scene">', renderLessonScene(ctx, "hero"), "</div>",
    '<div class="visual-result-plaque"><span>FINAL ARTIFACT</span>', artifacts.map((item, index) => '<b><i>' + String(index + 1).padStart(2, "0") + "</i>" + escapeHtml(item) + "</b>").join(""), "</div></section>"
  ].join("");
}

export function renderGoalsVisual(ctx) {
  const objectives = getVisualTextList(ctx.slide.objectives, 3, getVisualTextList(ctx.slide.body, 3, ["문제 이해", "작품 제작", "근거 설명"]));
  const success = getVisualTextList(ctx.slide.successCriteria || ctx.lesson.successCriteria, 1, ["완성 결과를 근거로 설명"]);
  return [
    '<section class="visual-goal-map visual-mission-map goal-route--', String(ctx.profile.route || 0), '"><div class="goal-map-watermark">', renderLessonScene(ctx, "compact"), "</div>",
    '<div class="goal-map-origin"><small>START</small><b>', escapeHtml(ctx.profile.code), "</b></div><ol>",
    objectives.map((item, index) => '<li style="--goal-index:' + index + '"><span>' + String(index + 1).padStart(2, "0") + "</span><b>" + escapeHtml(item) + "</b></li>").join(""),
    '</ol><div class="goal-success-ring"><span>SUCCESS</span><b>', escapeHtml(success[0]), "</b><i></i></div></section>"
  ].join("");
}

export function renderHookVisual(ctx) {
  const body = getVisualTextList(ctx.slide.body, 2, [ctx.profile.subtitle, "무엇이 달라져야 할까요?"]);
  const before = ctx.profile.tokens[0] || "현재";
  const after = ctx.profile.tokens[2] || "개선";
  return [
    '<section class="visual-contrast-stage"><article class="contrast-panel contrast-before"><small>BEFORE · 문제 장면</small><b>', escapeHtml(before),
    '</b><p>', escapeHtml(body[0]), '</p><div class="contrast-scene">', renderLessonScene(ctx, "compact"), "</div></article>",
    '<div class="contrast-lens"><span>WHY?</span><i></i></div><article class="contrast-panel contrast-after"><small>AFTER · 바라는 장면</small><b>',
    escapeHtml(after), '</b><p>', escapeHtml(body[1] || ctx.profile.subtitle), '</p><div class="contrast-proof"><i>01</i><i>02</i><i>03</i></div></article></section>'
  ].join("");
}

export function renderVocabularyVisual(ctx) {
  const terms = asList(ctx.slide.terms).slice(0, 3);
  const fallback = asList(ctx.profile.tokens).map((token) => ({ term: token, definition: ctx.profile.subtitle }));
  const items = terms.length ? terms : fallback;
  return [
    '<section class="visual-concept-atlas"><div class="atlas-index"><small>FIELD GUIDE</small><b>', escapeHtml(ctx.profile.title), '</b>',
    renderLessonScene(ctx, "compact"), '</div><div class="atlas-entries">',
    items.map((term, index) => '<article class="atlas-entry atlas-entry--' + (index + 1) + '"><span>' + String(index + 1).padStart(2, "0") + '</span><div class="atlas-glyph"><i></i><i></i><i></i></div><b>' + escapeHtml(term.term || visualValue(term)) + '</b><p>' + escapeHtml(shortenVisualText(term.definition || asList(ctx.slide.body)[index] || ctx.profile.subtitle, 76)) + "</p></article>").join(""),
    "</div></section>"
  ].join("");
}

export function renderConceptVisual(ctx) {
  const notes = getVisualTextList(ctx.slide.body, 4, asList(ctx.profile.tokens));
  return [
    '<section class="visual-mechanism-board"><div class="mechanism-grid"></div><div class="mechanism-scene">', renderLessonScene(ctx, "mechanism"), "</div>",
    '<div class="mechanism-notes">', notes.map((note, index) => '<span class="note-' + (index + 1) + '"><i>' + String(index + 1).padStart(2, "0") + "</i><b>" + escapeHtml(note) + "</b></span>").join(""),
    '</div><div class="mechanism-legend"><small>MODEL</small><b>', escapeHtml(ctx.profile.subtitle), "</b></div></section>"
  ].join("");
}

export function renderExampleVisual(ctx) {
  const input = getVisualTextList(ctx.slide.input, 2, [ctx.profile.tokens[0] || "입력"]);
  const process = getVisualTextList(ctx.slide.process, 2, [ctx.profile.tokens[1] || "규칙"]);
  const output = getVisualTextList(ctx.slide.output, 2, [ctx.profile.tokens[2] || "결과"]);
  const frames = [
    { label: "01 · INPUT", values: input },
    { label: "02 · PROCESS", values: process },
    { label: "03 · OUTPUT", values: output }
  ];
  return [
    '<section class="visual-story-filmstrip"><div class="film-perforation top"></div><div class="story-frames">',
    frames.map((frame, index) => '<article class="story-frame frame-' + (index + 1) + '"><small>' + frame.label + '</small>' + (index === 1 ? renderLessonScene(ctx, "compact") : '<div class="story-number">' + escapeHtml(ctx.profile.tokens[index] || String(index + 1)) + '</div>') + '<p>' + frame.values.map((value) => '<b>' + escapeHtml(value) + '</b>').join("") + "</p></article>").join(""),
    '</div><div class="film-compare"><span>SCENARIO</span><b>', escapeHtml(shortenVisualText(ctx.slide.scenario || ctx.slide.compare || ctx.profile.subtitle, 90)), '</b></div><div class="film-perforation bottom"></div></section>'
  ].join("");
}

export function renderCheckVisual(ctx) {
  const choices = asList(ctx.slide.choices).slice(0, 4);
  const safeChoices = choices.length ? choices : ["입력을 먼저 확인한다", "규칙을 다시 읽는다", "결과를 근거로 비교한다"];
  return [
    '<section class="visual-quiz-orbit"><div class="quiz-radar"><i class="ring-one"></i><i class="ring-two"></i><i class="sweep"></i><div class="quiz-core"><small>CHECK</small><b>',
    escapeHtml(shortenVisualText(ctx.slide.question || ctx.slide.title, 92)), '</b></div>',
    safeChoices.map((choice, index) => '<div class="quiz-choice choice-' + (index + 1) + '"><span>' + String.fromCharCode(65 + index) + "</span><b>" + escapeHtml(shortenVisualText(choice, 48)) + "</b></div>").join(""),
    '</div><p class="quiz-no-spoiler"><i>?</i> 먼저 근거를 찾고 실제 선택은 아래 활동에서 확인하세요.</p></section>'
  ].join("");
}

export function renderSetupVisual(ctx) {
  const checklist = getVisualTextList(ctx.slide.checklist, 4, ["재료 확인", "연결 확인", "안전 확인"]);
  return [
    '<section class="visual-topdown-bench"><div class="bench-surface"><div class="bench-photo">', renderAtmosphereAsset(ctx, "bench-product-image"),
    ctx.asset.kind === "module" ? '<span class="bench-module-label">MODI · ' + escapeHtml(ctx.asset.moduleLabel) + "</span>" : "", '</div><div class="bench-scene-card">', renderLessonScene(ctx, "compact"),
    '</div><div class="bench-tape tape-one"></div><div class="bench-tape tape-two"></div></div><div class="bench-checklist"><small>BEFORE POWER ON</small>',
    checklist.map((item, index) => '<label><span>' + (index + 1) + "</span><b>" + escapeHtml(item) + '</b><i aria-hidden="true">✓</i></label>').join(""), "</div></section>"
  ].join("");
}

export function renderPlanVisual(ctx) {
  const steps = getVisualTextList(ctx.slide.steps, 5, ["설계", "제작", "시험", "개선", "공유"]);
  const artifact = getVisualTextList(ctx.slide.studentArtifacts || ctx.lesson.studentArtifacts, 1, ["완성 작품"]);
  return [
    '<section class="visual-route-map route-variant--', String(ctx.profile.route || 0), '"><div class="route-map-compass"><i></i><b>N</b></div><ol>',
    steps.map((step, index) => '<li style="--route-step:' + index + '"><span>' + String(index + 1).padStart(2, "0") + "</span><b>" + escapeHtml(step) + "</b><i></i></li>").join(""),
    '</ol><div class="route-destination">FINISH<b>', escapeHtml(artifact[0]), '</b></div><div class="route-scene">', renderLessonScene(ctx, "compact"), "</div></section>"
  ].join("");
}

export function classifyBuildScene(slide) {
  const titleSource = String(slide.title || "").toLowerCase();
  const source = [slide.title, asList(slide.instructions).join(" "), slide.checkpoint].join(" ").toLowerCase();
  if (["범위", "사용자와 문제", "역할 분담", "팀 역할"].some((word) => titleSource.includes(word))) {
    return "brief";
  }
  const titleRules = [
    { kind: "iteration", words: ["수정", "개선", "디버그", "회귀", "보완"] },
    { kind: "assembly", words: ["연결", "조립", "배선", "회로", "장착", "모듈 구성"] },
    { kind: "logic", words: ["구현", "상태 변화", "제어", "코드", "알고리즘", "로그 만들기", "계산"] },
    { kind: "blueprint", words: ["설계", "구조", "스키마", "화면", "대시보드", "데이터 모델", "요구사항"] },
    { kind: "instrument", words: ["측정", "수집", "관찰", "기록", "센서 보정", "텔레메트리 분석"] },
    { kind: "testbench", words: ["시험", "검증", "테스트", "체크리스트", "e2e"] },
    { kind: "storyboard", words: ["발표", "시연", "리허설", "데모", "포트폴리오", "공유"] },
    { kind: "brief", words: ["범위", "목표", "문제", "사용자", "역할", "안전", "고정"] }
  ];
  const titleMatch = titleRules.find((rule) => rule.words.some((word) => titleSource.includes(word)));
  if (titleMatch) {
    return titleMatch.kind;
  }
  const rules = [
    { kind: "iteration", words: ["수정", "개선", "오류", "디버그", "회귀", "보완", "리팩터"] },
    { kind: "storyboard", words: ["발표", "시연", "리허설", "데모", "설명", "포트폴리오", "공유"] },
    { kind: "assembly", words: ["연결", "조립", "배선", "모듈", "회로", "장착", "전원"] },
    { kind: "instrument", words: ["측정", "관찰", "수집", "기록", "센서", "보정", "텔레메트리", "로그"] },
    { kind: "testbench", words: ["시험", "검증", "테스트", "확인", "경계", "종단", "e2e"] },
    { kind: "logic", words: ["구현", "상태", "제어", "코드", "블록", "알고리즘", "정렬", "계산", "처리"] },
    { kind: "blueprint", words: ["설계", "구조", "스키마", "데이터", "화면", "요구사항", "정책", "모델"] },
    { kind: "brief", words: ["안전", "역할", "문제", "사용자", "범위", "목표", "고정"] }
  ];
  const match = rules.find((rule) => rule.words.some((word) => source.includes(word)));
  if (match) {
    return match.kind;
  }
  return ["brief", "blueprint", "assembly", "logic", "instrument", "testbench", "iteration", "storyboard"][(Math.max(1, Number(slide.stepNumber) || 1) - 1) % 8];
}

export function renderBuildBrief(ctx, instructions) {
  return '<div class="build-brief-canvas"><div class="build-brief-target"><small>WHO · NEED · RESULT</small><b>' + escapeHtml(instructions[0]) + '</b></div><div class="build-sticky-cloud">' + instructions.slice(1).map((item, index) => '<span class="sticky-' + (index + 1) + '">' + escapeHtml(item) + "</span>").join("") + '</div><div class="build-brief-scene">' + renderLessonScene(ctx, "compact") + "</div></div>";
}

export function renderBuildBlueprint(ctx, instructions) {
  return '<div class="build-blueprint-sheet"><div class="blueprint-grid"></div><div class="blueprint-scene">' + renderLessonScene(ctx, "mechanism") + '</div><div class="blueprint-specs">' + instructions.map((item, index) => '<span><i>' + String(index + 1).padStart(2, "0") + "</i><b>" + escapeHtml(item) + "</b></span>").join("") + "</div></div>";
}

export function renderBuildAssembly(ctx, instructions) {
  return '<div class="build-assembly-bench"><div class="assembly-product">' + renderAtmosphereAsset(ctx, "assembly-product-image") + '<span class="assembly-ring ring-a"></span><span class="assembly-ring ring-b"></span></div><ol>' + instructions.map((item, index) => '<li><span>' + (index + 1) + "</span><b>" + escapeHtml(item) + "</b></li>").join("") + "</ol></div>";
}

export function renderBuildLogic(ctx, instructions) {
  const rails = instructions.slice(0, 3);
  return '<div class="build-logic-console"><div class="logic-state-rail">' + asList(ctx.profile.tokens).map((token, index) => '<span><i>' + (index ? "→" : "●") + "</i><b>" + escapeHtml(token) + "</b></span>").join("") + '</div><div class="logic-blocks">' + rails.map((item, index) => '<code><span>' + ["IF", "THEN", "VERIFY"][index] + "</span>" + escapeHtml(item) + "</code>").join("") + '</div><div class="logic-monitor">' + renderLessonScene(ctx, "compact") + "</div></div>";
}

export function renderBuildInstrument(ctx, instructions) {
  return '<div class="build-instrument-panel"><div class="instrument-chart">' + Array.from({ length: 14 }, (_value, index) => '<i style="--bar:' + (16 + (index * 29) % 78) + '%"></i>').join("") + '<span>LIVE SAMPLE</span></div><div class="instrument-gauge"><i></i><b>' + escapeHtml(ctx.profile.tokens[1] || "MEASURE") + '</b></div><ul>' + instructions.map((item) => "<li>" + escapeHtml(item) + "</li>").join("") + "</ul></div>";
}

export function renderBuildTestbench(ctx, instructions) {
  return '<div class="build-testbench"><div class="testbench-head"><span>CASE</span><span>EXPECTED</span><span>EVIDENCE</span></div>' + instructions.slice(0, 4).map((item, index) => '<div class="testbench-row"><b>T-' + String(index + 1).padStart(2, "0") + "</b><span>" + escapeHtml(item) + '</span><i class="' + (index % 3 === 2 ? "watch" : "pass") + '">' + (index % 3 === 2 ? "WATCH" : "PASS") + "</i></div>").join("") + '<div class="testbench-scene">' + renderLessonScene(ctx, "compact") + "</div></div>";
}

export function renderBuildIteration(ctx, instructions) {
  return '<div class="build-iteration"><article><small>BEFORE</small><b>' + escapeHtml(instructions[0]) + '</b><div class="iteration-bug">!</div></article><div class="iteration-diff"><i>−</i><span>원인 한 가지씩 분리</span><i>+</i></div><article><small>AFTER</small><b>' + escapeHtml(instructions[1] || instructions[0]) + '</b><div class="iteration-pass">PASS</div></article></div>';
}

export function renderBuildStoryboard(ctx, instructions) {
  return '<div class="build-storyboard"><div class="storyboard-stage">' + renderLessonScene(ctx, "compact") + '</div><ol>' + instructions.slice(0, 4).map((item, index) => '<li><span>' + String(index + 1).padStart(2, "0") + "</span><b>" + escapeHtml(item) + "</b><i>" + (index + 1) * 30 + "s</i></li>").join("") + "</ol></div>";
}

export function renderBuildVisual(ctx) {
  const buildKind = classifyBuildScene(ctx.slide);
  const instructions = getVisualTextList(ctx.slide.instructions, 4, getVisualTextList(ctx.slide.body, 4, ["핵심 단계 실행", "결과 확인", "증거 남기기"]));
  const renderers = {
    brief: renderBuildBrief,
    blueprint: renderBuildBlueprint,
    assembly: renderBuildAssembly,
    logic: renderBuildLogic,
    instrument: renderBuildInstrument,
    testbench: renderBuildTestbench,
    iteration: renderBuildIteration,
    storyboard: renderBuildStoryboard
  };
  const body = [
    '<section class="visual-maker-blueprint build-scene--', buildKind, '"><header><span>STEP ', String(ctx.slide.stepNumber || 1), " / ", String(ctx.slide.stepTotal || "?"), "</span><b>",
    escapeHtml(ctx.slide.title), "</b></header>", renderers[buildKind](ctx, instructions),
    '<footer><span>CHECKPOINT</span><b>', escapeHtml(shortenVisualText(ctx.slide.checkpoint || "실행 결과와 근거를 확인하세요.", 92)), "</b></footer></section>"
  ].join("");
  return renderVisualShell(ctx, body, { buildKind });
}

export function renderCheckpointVisual(ctx) {
  const criteria = getVisualTextList(ctx.slide.criteria, 4, ["동작 증거", "설계 일치", "수정 기록"]);
  const artifacts = getVisualTextList(ctx.slide.studentArtifacts || ctx.lesson.studentArtifacts, 2, ["완성 화면", "제작 기록"]);
  return [
    '<section class="visual-evidence-pinboard"><div class="pinboard-title"><small>EVIDENCE WALL</small><b>', escapeHtml(ctx.profile.title), '</b></div><div class="evidence-polaroids">',
    artifacts.map((item, index) => '<article class="polaroid-' + (index + 1) + '"><div>' + renderLessonScene(ctx, "compact") + '</div><b>' + escapeHtml(item) + "</b><i></i></article>").join(""),
    '</div><ul>', criteria.map((item, index) => '<li><span>' + (index + 1) + "</span><b>" + escapeHtml(item) + '<i class="evidence-stamp">PROOF</i></b></li>').join(""), "</ul></section>"
  ].join("");
}

export function renderTroubleshootVisual(ctx) {
  const issues = asList(ctx.slide.issues).slice(0, 3);
  const safeIssues = issues.length ? issues : [{ symptom: "예상과 다른 결과", cause: "입력·상태·연결 중 하나", fix: "한 항목씩 고치고 다시 시험" }];
  return [
    '<section class="visual-diagnostic-tree"><div class="diagnostic-root"><span>?</span><b>', escapeHtml(ctx.profile.title), '</b><small>증상을 먼저 재현</small></div><div class="diagnostic-trunk"></div><div class="diagnostic-branches">',
    safeIssues.map((issue, index) => '<article><div class="symptom"><small>SYMPTOM ' + String(index + 1).padStart(2, "0") + "</small><b>" + escapeHtml(shortenVisualText(issue.symptom || "문제 재현", 58)) + '</b></div><i></i><div class="cause"><small>CAUSE</small><b>' + escapeHtml(shortenVisualText(issue.cause || "원인 분리", 58)) + '</b></div><i></i><div class="fix"><small>FIX</small><b>' + escapeHtml(shortenVisualText(issue.fix || "수정 후 재시험", 58)) + "</b></div></article>").join(""),
    "</div></section>"
  ].join("");
}

export function renderDifferentiateVisual(ctx) {
  const support = getVisualTextList(ctx.slide.support, 2, ["핵심 기능부터 완성", "제공된 예시로 다시 시도"]);
  const challenge = getVisualTextList(ctx.slide.challenge, 2, ["새 조건으로 확장", "다른 상황까지 시험"]);
  const core = getVisualTextList(ctx.lesson.successCriteria, 1, [ctx.profile.subtitle]);
  return [
    '<section class="visual-branch-lanes"><div class="branch-core">CORE<b>', escapeHtml(core[0]), '</b><i></i></div><div class="branch-split"><i></i><i></i></div>',
    '<article class="branch-support"><span>SUPPORT ROUTE</span>', support.map((item, index) => '<b><i>' + (index + 1) + "</i>" + escapeHtml(item) + "</b>").join(""), '</article>',
    '<article class="branch-challenge"><span>CHALLENGE ROUTE</span>', challenge.map((item, index) => '<b><i>' + (index + 1) + "</i>" + escapeHtml(item) + "</b>").join(""), '</article>',
    '<div class="branch-finish">같은 목표 · 다른 경로</div></section>'
  ].join("");
}

export function renderRubricVisual(ctx) {
  const rows = asList(ctx.slide.rows).slice(0, 4);
  const safeRows = rows.length ? rows : [{ criterion: "기능", basic: "도움 받아 동작", proficient: "스스로 동작", advanced: "새 조건까지 확장" }];
  return [
    '<section class="visual-rubric-heatmap"><div class="heatmap-head"><b>CRITERION</b><span>기초</span><span>도달</span><span>심화</span></div>',
    safeRows.map((row, index) => '<div class="heatmap-row"><b>' + escapeHtml(row.criterion) + '</b><span data-level="1">' + escapeHtml(shortenVisualText(row.basic, 38)) + '</span><span data-level="2">' + escapeHtml(shortenVisualText(row.proficient, 38)) + '</span><span data-level="3">' + escapeHtml(shortenVisualText(row.advanced, 38)) + "</span><i>" + String(index + 1).padStart(2, "0") + "</i></div>").join(""),
    '<div class="heatmap-evidence">평가는 작품이 아니라 <b>작품 + 과정 + 근거</b>를 함께 봅니다.</div></section>'
  ].join("");
}

export function renderExitVisual(ctx) {
  const takeaways = getVisualTextList(ctx.slide.takeaways, 3, asList(ctx.profile.tokens));
  return [
    '<section class="visual-completion-orbit"><div class="completion-core"><i></i><span>MISSION</span><b>COMPLETE</b><small>', escapeHtml(ctx.profile.code), '</small></div><div class="completion-ring ring-a"></div><div class="completion-ring ring-b"></div>',
    takeaways.map((item, index) => '<article class="takeaway-' + (index + 1) + '"><span>' + String(index + 1).padStart(2, "0") + "</span><b>" + escapeHtml(item) + "</b></article>").join(""),
    '<div class="next-gate"><small>NEXT MISSION</small><b>', escapeHtml(shortenVisualText(ctx.slide.question || "오늘의 근거를 다음 프로젝트에 연결하세요.", 82)), "</b><i>→</i></div></section>"
  ].join("");
}

export const SLIDE_VISUAL_RENDERERS = {
  title: renderTitleVisual,
  goals: renderGoalsVisual,
  hook: renderHookVisual,
  vocabulary: renderVocabularyVisual,
  concept: renderConceptVisual,
  example: renderExampleVisual,
  check: renderCheckVisual,
  setup: renderSetupVisual,
  plan: renderPlanVisual,
  checkpoint: renderCheckpointVisual,
  troubleshoot: renderTroubleshootVisual,
  differentiate: renderDifferentiateVisual,
  rubric: renderRubricVisual,
  exit: renderExitVisual
};

export function renderLessonSlideVisual(levelId, lesson, slide, slideIndex) {
  const ctx = createSlideVisualContext(levelId, lesson, slide, slideIndex);
  if (slide.type === "build") {
    return renderBuildVisual(ctx);
  }
  const renderer = SLIDE_VISUAL_RENDERERS[slide.type] || renderConceptVisual;
  return renderVisualShell(ctx, renderer(ctx));
}
