// MODI Planet LMS — 수업 활동실. 탭, 모바일 시트, MODI 패널.

import { asList, escapeHtml, learningStudio, studioBackdrop, studioToggle } from "./dom.js";
import { renderPreview } from "./preview.js";
import { state } from "./state.js";

export function usesMobileStudio() {
  return window.matchMedia("(max-width: 980px)").matches;
}

export function syncStudioAccessibility() {
  const mobile = usesMobileStudio();
  const open = mobile && state.studioOpen;
  const backgroundSections = document.querySelectorAll(".player-header, .slide-rail, .slide-stage");
  learningStudio.classList.toggle("mobile-open", open);
  studioBackdrop.classList.toggle("open", open);
  studioBackdrop.disabled = !open;
  studioBackdrop.setAttribute("aria-hidden", open ? "false" : "true");
  studioToggle.setAttribute("aria-expanded", open ? "true" : "false");
  studioToggle.textContent = open ? "활동실 닫기" : "활동실 열기";
  learningStudio.setAttribute("aria-hidden", mobile && !open ? "true" : "false");
  if (mobile && !open) {
    learningStudio.setAttribute("inert", "");
  } else {
    learningStudio.removeAttribute("inert");
  }
  backgroundSections.forEach((section) => {
    if (open) {
      section.setAttribute("inert", "");
    } else {
      section.removeAttribute("inert");
    }
  });
}

export function openStudio() {
  if (!state.activeLesson || !usesMobileStudio()) {
    return;
  }
  state.studioOpen = true;
  syncStudioAccessibility();
  document.getElementById("closeStudioButton").focus();
}

export function closeStudio(options) {
  const settings = options || {};
  const wasOpen = state.studioOpen;
  state.studioOpen = false;
  syncStudioAccessibility();
  if (wasOpen && settings.restoreFocus !== false && usesMobileStudio()) {
    studioToggle.focus();
  }
}

export function renderStudio() {
  const slide = state.activeLesson.slides[state.slideIndex];
  learningStudio.classList.toggle("preview-mode", state.studioTab === "preview");
  document.querySelectorAll("[data-studio-tab]").forEach((button) => {
    const active = button.dataset.studioTab === state.studioTab;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", active ? "true" : "false");
    button.setAttribute("tabindex", active ? "0" : "-1");
  });
  const studio = document.getElementById("studioBody");
  studio.setAttribute("aria-live", state.studioTab === "activity" ? "polite" : "off");
  const activeTabButton = document.querySelector('[data-studio-tab="' + state.studioTab + '"]');
  if (activeTabButton) {
    studio.setAttribute("aria-labelledby", activeTabButton.id);
  }
  if (state.studioTab === "preview") {
    studio.innerHTML = renderPreview();
    syncTutorComposerState();
    return;
  }
  if (state.studioTab === "modi") {
    studio.innerHTML = renderModiPanel();
    syncTutorComposerState();
    return;
  }

  const prompts = asList(slide.prompts);
  const body = asList(slide.instructions).length ? asList(slide.instructions) : asList(slide.body);
  const activityTitle = slide.type === "build"
    ? "제작 " + slide.stepNumber + "/" + slide.stepTotal + " · 통과 조건을 확인하세요"
    : slide.type === "ai" ? "AI 제작 활동" : "현재 수업 활동";
  studio.innerHTML = [
    '<div class="activity-panel"><h3>', escapeHtml(activityTitle), "</h3>",
    "<p>", escapeHtml(slide.title), "</p>",
    body.length ? '<div class="activity-checklist">' + body.map((line, index) => [
      '<label><input type="checkbox" data-checkpoint="', String(index), '"', asList(state.checklistAnswers[String(state.slideIndex)]).includes(index) ? " checked" : "", '><span>', escapeHtml(line), "</span></label>"
    ].join("")).join("") + "</div>" : "",
    prompts.length ? '<div class="prompt-list">' + prompts.map((prompt) => (
      '<button class="prompt-button" type="button" data-prompt="' + escapeHtml(prompt) + '">' + escapeHtml(prompt) + "</button>"
    )).join("") + "</div>" : "",
    !body.length && !prompts.length ? '<div class="studio-empty"><div><span class="empty-icon">✓</span><strong>수업 화면에 집중하세요</strong><span>제작 단계에서 체크리스트와 AI 예시가 나타납니다.</span></div></div>' : "",
    slide.checkpoint ? '<div class="studio-checkpoint"><b>통과 조건</b>' + escapeHtml(slide.checkpoint) + "</div>" : "",
    renderChatThread(),
    "</div>"
  ].join("");
  syncTutorComposerState();
}

export function syncTutorComposerState() {
  const input = document.getElementById("tutorInput");
  const button = document.querySelector("#tutorForm button[type='submit']");
  if (!input || !button) {
    return;
  }
  input.disabled = state.streaming;
  button.disabled = state.streaming;
  button.setAttribute("aria-busy", state.streaming ? "true" : "false");
}

export function renderChatThread() {
  return '<div class="chat-thread" id="chatThread">' + state.chatMessages.map((message) => (
    '<div class="chat-message ' + escapeHtml(message.type) + '">' + escapeHtml(message.text) + "</div>"
  )).join("") + "</div>";
}

export function renderModiPanel() {
  const lesson = state.activeLesson;
  if (lesson.projectType === "web" && !state.blocklyXml && !state.modiModules.length) {
    return '<div class="studio-empty"><div><span class="empty-icon">Web</span><strong>Web 중심 차시입니다</strong><span>4차시부터 MODI 하드웨어 활동이 시작됩니다.</span></div></div>';
  }
  const modules = state.modiModules.length ? state.modiModules.map((module) => (
    typeof module === "string" ? module : module.type || module.name || JSON.stringify(module)
  )) : asList(lesson.materials);
  return [
    '<div class="modi-panel"><h3>MODI 하드웨어 준비</h3><p>이 차시 교안에 지정된 준비물과 생성된 블록을 확인합니다.</p>',
    '<div class="material-chips">', modules.map((module) => "<span>" + escapeHtml(module) + "</span>").join(""), "</div>",
    state.blocklyXml ? '<pre class="code-output">' + escapeHtml(state.blocklyXml) + "</pre>" : "",
    "</div>"
  ].join("");
}

export function setStudioTab(tab) {
  state.studioTab = tab;
  renderStudio();
}
