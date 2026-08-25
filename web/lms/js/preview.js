// MODI Planet LMS — 결과 미리보기와 2.5D 프리셋 무대.

import { PREVIEW_PRESETS, WORLD_PROFILES } from "./config.js";
import { asList, escapeHtml } from "./dom.js";
import { getActiveCatalog, lessonKey, state } from "./state.js";

// 프리뷰 무대의 시차 깊이. 포인터 상태는 이 모듈 안에서만 변형한다.
export const DEPTH_POINTER_QUERY = window.matchMedia("(hover: hover) and (pointer: fine)");
export const REDUCED_MOTION_QUERY = window.matchMedia("(prefers-reduced-motion: reduce)");
export let previewDepthFrame = 0;
export let pendingDepthUpdate = null;

export function handlePreviewPointerMove(event) {
  const stage = event.target.closest(".preview-result-stage");
  if (!stage
    || !DEPTH_POINTER_QUERY.matches
    || REDUCED_MOTION_QUERY.matches) {
    return;
  }
  pendingDepthUpdate = { stage, clientX: event.clientX, clientY: event.clientY };
  if (previewDepthFrame) {
    return;
  }
  previewDepthFrame = window.requestAnimationFrame(() => {
    const update = pendingDepthUpdate;
    pendingDepthUpdate = null;
    previewDepthFrame = 0;
    if (!update || !update.stage.isConnected) {
      return;
    }
    const rect = update.stage.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const x = Math.max(0, Math.min(1, (update.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (update.clientY - rect.top) / rect.height));
    update.stage.style.setProperty("--world-pan-x", ((0.5 - x) * 14).toFixed(2) + "px");
    update.stage.style.setProperty("--world-pan-y", ((0.5 - y) * 9).toFixed(2) + "px");
    update.stage.style.setProperty("--world-near-x", ((x - 0.5) * 18).toFixed(2) + "px");
    update.stage.style.setProperty("--world-near-y", ((y - 0.5) * 12).toFixed(2) + "px");
    update.stage.style.setProperty("--object-rotate-x", ((0.5 - y) * 7).toFixed(2) + "deg");
    update.stage.style.setProperty("--object-rotate-y", ((x - 0.5) * 10).toFixed(2) + "deg");
  });
}

export function handlePreviewPointerOut(event) {
  const stage = event.target.closest(".preview-result-stage");
  if (!stage || stage.contains(event.relatedTarget)) {
    return;
  }
  if (pendingDepthUpdate && pendingDepthUpdate.stage === stage) {
    pendingDepthUpdate = null;
  }
  ["--world-pan-x", "--world-pan-y", "--world-near-x", "--world-near-y", "--object-rotate-x", "--object-rotate-y"].forEach((property) => stage.style.removeProperty(property));
}

export function getPreviewPreset(lesson, catalog) {
  const key = lessonKey(catalog.level, lesson.no);
  return PREVIEW_PRESETS[key] || {
    product: lesson.title,
    eyebrow: "차시 완성 예시",
    primaryLabel: "완성 상태",
    primaryValue: "READY",
    status: "샘플 데이터",
    message: lesson.summary,
    metrics: [["차시", lesson.no + "차시"], ["유형", lesson.projectType], ["준비", "완료"]],
    meter: 84,
    action: "샘플 실행",
    activeStatus: "예시 실행 완료",
    activePrimary: "DONE"
  };
}

export function getPreviewExample(lesson) {
  return asList(lesson.slides).find((slide) => slide.type === "example") || {};
}

export function renderPreviewSourceSwitch(activeSource, hasGenerated) {
  if (!hasGenerated) {
    return "";
  }
  return [
    '<div class="preview-source-switch" role="tablist" aria-label="미리보기 결과 선택">',
    '<button type="button" role="tab" id="presetPreviewTab" aria-controls="previewResultPanel" aria-selected="', activeSource === "preset" ? "true" : "false", '" tabindex="', activeSource === "preset" ? "0" : "-1", '" data-preview-source="preset">완성 예시</button>',
    '<button type="button" role="tab" id="generatedPreviewTab" aria-controls="previewResultPanel" aria-selected="', activeSource === "mine" ? "true" : "false", '" tabindex="', activeSource === "mine" ? "0" : "-1", '" data-preview-source="mine"><span aria-hidden="true">●</span> 내 결과</button>',
    "</div>"
  ].join("");
}

export function renderPreviewMetrics(preset) {
  return '<div class="seed-metric-grid">' + asList(preset.metrics).map((metric) => [
    "<div><span>", escapeHtml(metric[0]), "</span><strong>", escapeHtml(metric[1]), "</strong></div>"
  ].join("")).join("") + "</div>";
}

export function renderWorldPortal(world, lesson, preset) {
  return [
    '<div class="seed-world-portal" aria-hidden="true">',
    '<div class="seed-world-depth"><i></i><i></i><i></i></div>',
    '<div class="seed-world-vignette"></div><div class="seed-world-orbit"><i></i><i></i><i></i></div>',
    '<div class="seed-world-meta"><span>', escapeHtml(world.name), '</span><strong>MISSION ', String(lesson.no).padStart(2, "0"), '</strong><small>', escapeHtml(world.zone), ' · ', escapeHtml(preset.eyebrow), '</small></div>',
    '<div class="seed-world-beacon"><i></i><i></i><i></i><i></i></div>',
    '</div>'
  ].join("");
}

export function renderWebPreset(preset, active, world, lesson) {
  const primary = active ? preset.activePrimary : preset.primaryValue;
  const status = active ? preset.activeStatus : preset.status;
  return [
    '<div class="seed-web-app world-', escapeHtml(world.id), active ? " is-running" : "", '">',
    renderWorldPortal(world, lesson, preset),
    '<div class="seed-web-spark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>',
    '<div class="seed-scene-camera seed-scene-camera-web">',
    '<div class="seed-app-nav"><span class="seed-app-logo" aria-hidden="true">M</span><b>', escapeHtml(preset.product), '</b><span class="seed-status">', escapeHtml(status), "</span></div>",
    '<div class="seed-app-hero"><div class="seed-hero-labels"><span class="seed-eyebrow">', escapeHtml(preset.eyebrow), '</span><b>AI READY</b></div><p>', escapeHtml(preset.primaryLabel), '</p><strong class="seed-primary-value" role="status" aria-live="polite">', escapeHtml(primary), "</strong><small>", escapeHtml(preset.message), "</small>",
    '<div class="seed-visualizer" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>',
    '<div class="seed-progress" aria-label="완성도 ', String(preset.meter), '%"><i style="width:', String(preset.meter), '%"></i></div></div>',
    renderPreviewMetrics(preset),
    '<button class="seed-run-button" type="button" data-preview-action="demo"><span aria-hidden="true">', active ? "↻" : "▶", "</span>", escapeHtml(active ? "처음 상태로 되돌리기" : preset.action), "</button>",
    "</div></div>"
  ].join("");
}

export function renderHardwarePreset(preset, active, world, lesson) {
  const primary = active ? preset.activePrimary : preset.primaryValue;
  const status = active ? preset.activeStatus : preset.status;
  return [
    '<div class="seed-hardware world-', escapeHtml(world.id), active ? " is-running" : "", '">',
    renderWorldPortal(world, lesson, preset),
    '<div class="seed-hw-banner"><span><i></i> DIGITAL TWIN</span><b>MODI LAB</b><div aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
    '<div class="seed-scene-camera seed-scene-camera-hardware">',
    '<div class="seed-device-flow" aria-label="입력 처리 출력 흐름">',
    '<div><span>INPUT</span><strong>', escapeHtml(preset.input || "센서 입력"), '</strong></div><i aria-hidden="true">→</i>',
    '<div><span>LOGIC</span><strong>', escapeHtml(preset.logic || "조건 처리"), '</strong></div><i aria-hidden="true">→</i>',
    '<div><span>OUTPUT</span><strong>', escapeHtml(preset.output || "장치 출력"), "</strong></div></div>",
    '<div class="seed-device-stage"><div class="seed-device-visual" aria-hidden="true"><span class="seed-sensor-wave"></span><div class="seed-modi-core"><i></i><b>M</b><i></i></div><span class="seed-device-output"></span></div>',
    '<div class="seed-device-readout"><span class="seed-eyebrow">', escapeHtml(preset.eyebrow), '</span><p>', escapeHtml(preset.primaryLabel), '</p><strong class="seed-primary-value" role="status" aria-live="polite">', escapeHtml(primary), '</strong><span class="seed-status">', escapeHtml(status), "</span><small>", escapeHtml(preset.message), "</small></div></div>",
    renderPreviewMetrics(preset),
    '<div class="seed-signal-track" aria-label="샘플 신호 흐름"><span>00:01</span><div aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><b>SYNC</b></div>',
    '<button class="seed-run-button" type="button" data-preview-action="demo"><span aria-hidden="true">', active ? "↻" : "▶", "</span>", escapeHtml(active ? "시뮬레이션 초기화" : preset.action), "</button>",
    "</div></div>"
  ].join("");
}

export function renderConnectedPreset(preset, active, world, lesson) {
  const primary = active ? preset.activePrimary : preset.primaryValue;
  const status = active ? preset.activeStatus : preset.status;
  const missionMark = world.id === "high" ? "◈" : world.id === "middle" ? "✦" : "M";
  return [
    '<div class="seed-ops world-', escapeHtml(world.id), active ? " is-running" : "", '">',
    renderWorldPortal(world, lesson, preset),
    '<div class="seed-ops-glow" aria-hidden="true"><i></i><i></i><i></i></div>',
    '<div class="seed-scene-camera seed-scene-camera-ops">',
    '<div class="seed-ops-head"><div><span class="seed-live-dot" aria-hidden="true"></span><b>MODI CONTROL</b><small>SIMULATION</small></div><button type="button" data-preview-action="demo">', escapeHtml(active ? "RESET" : preset.action), "</button></div>",
    '<div class="seed-ops-grid"><div class="seed-rover-panel"><div class="seed-rover-scene" aria-hidden="true"><span class="seed-road-line"></span><div class="seed-rover"><i></i><b>', missionMark, '</b><i></i></div><span class="seed-obstacle"></span></div>',
    '<div class="seed-flow-caption"><span>', escapeHtml(preset.input || "장치 데이터"), '</span><i aria-hidden="true">↔</i><span>', escapeHtml(preset.output || "관제 명령"), "</span></div></div>",
    '<div class="seed-telemetry"><span class="seed-eyebrow">', escapeHtml(preset.eyebrow), '</span><p>', escapeHtml(preset.primaryLabel), '</p><strong class="seed-primary-value" role="status" aria-live="polite">', escapeHtml(primary), '</strong><span class="seed-status">', escapeHtml(status), "</span>", renderPreviewMetrics(preset), "</div></div>",
    '<div class="seed-event-log"><span><i></i> TELEMETRY</span><b>', escapeHtml(preset.logic || "양방향 데이터 흐름"), "</b><small>", escapeHtml(preset.message), '</small><div class="seed-console-chart" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>',
    "</div></div>"
  ].join("");
}

export function renderPresetScene(lesson, preset, catalog) {
  const world = WORLD_PROFILES[catalog.level] || WORLD_PROFILES.elementary;
  if (lesson.projectType === "hw") {
    return renderHardwarePreset(preset, state.previewDemoActive, world, lesson);
  }
  if (lesson.projectType === "webhw") {
    return renderConnectedPreset(preset, state.previewDemoActive, world, lesson);
  }
  return renderWebPreset(preset, state.previewDemoActive, world, lesson);
}

export function renderPresetPreview(lesson, catalog, hasGenerated) {
  const preset = getPreviewPreset(lesson, catalog);
  const example = getPreviewExample(lesson);
  const evidence = asList(example.output).slice(0, 3);
  const artifacts = asList(lesson.studentArtifacts).slice(-2);
  const modeLabel = lesson.projectType === "hw" ? "H/W 디지털 트윈" : lesson.projectType === "webhw" ? "Web + H/W 관제" : "Web 앱";
  return [
    '<section class="preview-showcase" data-preview-key="', escapeHtml(lessonKey(catalog.level, lesson.no)), '" data-preview-mode="', escapeHtml(lesson.projectType), '" data-world="', escapeHtml(catalog.level), '">',
    renderPreviewSourceSwitch("preset", hasGenerated),
    '<div class="preview-heading"><div class="preview-badge-row"><span class="preview-demo-badge">완성 예시</span><span class="preview-mode-badge ', escapeHtml(lesson.projectType), '">', escapeHtml(modeLabel), '</span><span class="preview-preloaded-label">수업 시작 전</span></div><h3 id="presetPreviewTitle">', escapeHtml(preset.product), "</h3><p>", escapeHtml(example.scenario || lesson.summary), "</p></div>",
    '<div class="preview-window preview-window-preset"><div class="preview-bar"><span class="preview-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="preview-address">preview.modiplanet.com · ', String(lesson.no).padStart(2, "0"), '</span><span class="preview-sample-label">샘플 데이터</span></div>',
    '<div class="preview-result-stage" id="previewResultPanel" role="tabpanel"', hasGenerated ? ' aria-labelledby="presetPreviewTab"' : ' aria-labelledby="presetPreviewTitle"', ">", renderPresetScene(lesson, preset, catalog), "</div></div>",
    '<div class="preview-proof"><div class="preview-proof-head"><strong>결과에서 확인할 것</strong><span>완성 기준 ', String(evidence.length), '개</span></div><ul>', evidence.map((item) => '<li><span aria-hidden="true">✓</span><p>' + escapeHtml(item) + "</p></li>").join(""), "</ul></div>",
    '<div class="preview-artifacts"><div><span>STUDENT OUTPUT</span><strong>이 차시에서 남기는 결과물</strong></div><ul>', artifacts.map((item, index) => '<li><i aria-hidden="true">0' + String(index + 1) + '</i><span>' + escapeHtml(item) + "</span></li>").join(""), "</ul></div>",
    '<div class="preview-note"><span aria-hidden="true">✦</span><p><strong>미리 준비된 수업 예시입니다.</strong> 실제 장치 연결이나 학생 결과가 아니며, AI로 제작하면 <b>내 결과</b> 화면으로 자동 전환됩니다.</p></div>',
    '<button class="preview-start-button" type="button" data-preview-action="start"><span>이 완성 예시로 시작하기</span><i aria-hidden="true">→</i></button>',
    "</section>"
  ].join("");
}

export function renderPreviewFrame(source, title) {
  return '<div class="preview-window preview-window-generated"><div class="preview-bar"><span class="preview-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="preview-address">내 작품 · 실시간 미리보기</span><span class="preview-live-badge"><i></i> LIVE</span></div><iframe title="' + escapeHtml(title) + '" sandbox="allow-scripts" srcdoc="' + escapeHtml(source) + '"></iframe></div>';
}

export function renderPreview() {
  const names = Object.keys(state.files);
  const lesson = state.activeLesson;
  const catalog = getActiveCatalog();
  if (!names.length || state.previewSource !== "mine") {
    return renderPresetPreview(lesson, catalog, names.length > 0);
  }
  const htmlName = names.find((name) => name.toLowerCase().endsWith(".html"));
  const sourceSwitch = renderPreviewSourceSwitch("mine", true);
  if (htmlName) {
    return '<section class="preview-showcase preview-showcase-generated">' + sourceSwitch + '<div class="preview-heading"><div class="preview-badge-row"><span class="preview-demo-badge live">내 결과</span><span class="preview-preloaded-label">AI 생성 완료</span></div><h3>직접 만든 작품</h3><p>완성 예시와 비교하며 바꾸고 싶은 부분을 이어서 요청해 보세요.</p></div><div id="previewResultPanel" role="tabpanel" aria-labelledby="generatedPreviewTab">' + renderPreviewFrame(state.files[htmlName], lesson.title + " — 학생 작품 미리보기") + '</div><div class="preview-note live"><span aria-hidden="true">✓</span><p><strong>내 결과가 준비되었습니다.</strong> 완성 예시와 오가며 내용·동작·읽기 쉬움을 비교할 수 있습니다.</p></div></section>';
  }
  const firstName = names[0];
  return '<section class="preview-showcase preview-showcase-generated">' + sourceSwitch + '<div class="preview-heading"><div class="preview-badge-row"><span class="preview-demo-badge live">내 결과</span><span class="preview-preloaded-label">코드 생성 완료</span></div><h3>생성된 파일</h3><p>웹 화면이 아닌 코드·블록 결과를 확인합니다.</p></div><div id="previewResultPanel" role="tabpanel" aria-labelledby="generatedPreviewTab"><pre class="code-output">' + escapeHtml(firstName + "\n\n" + state.files[firstName]) + "</pre></div></section>";
}
