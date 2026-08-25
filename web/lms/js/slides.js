// MODI Planet LMS — 슬라이드 진행. 레일, 본문, 이동, 퀴즈.

import { MODES } from "./config.js";
import { asList, escapeHtml, isQuizSlide, renderBulletList, renderRubricTable, showToast, totalMinutes } from "./dom.js";
import { exitLesson } from "./player.js";
import { renderLessonSlideVisual } from "./slide-visuals.js";
import { getActiveCatalog, state } from "./state.js";
import { renderStudio } from "./studio.js";

export function renderSlideRail() {
  const lesson = state.activeLesson;
  document.getElementById("slideRail").innerHTML = [
    '<p class="slide-rail-summary">', escapeHtml(MODES[lesson.projectType].label), " · ", String(totalMinutes(lesson)), "분 · ", String(lesson.slides.length), "단계</p>",
    asList(lesson.slides).map((slide, index) => [
      '<button type="button" class="slide-step ', index === state.slideIndex ? "active" : "", " ", index < state.slideIndex ? "completed" : "",
      '" data-slide-index="', String(index), '"', index === state.slideIndex ? ' aria-current="step"' : "", '><span class="step-index">', index < state.slideIndex ? "✓" : String(index + 1),
      "</span><span><strong>", escapeHtml(slide.title), "</strong><small>", escapeHtml(slide.phase), " · ", String(slide.minutes || 0), "분</small></span></button>"
    ].join("")).join("")
  ].join("");
}

export function renderQuizContent(slide) {
  const takeaways = asList(slide.takeaways);
  const answerKey = String(state.slideIndex);
  const answered = Object.prototype.hasOwnProperty.call(state.quizAnswers, answerKey);
  const selected = answered ? Number(state.quizAnswers[answerKey]) : -1;
  return [
    "<h2>", escapeHtml(slide.title), "</h2>",
    '<p class="quiz-question">Q. ', escapeHtml(slide.question), "</p>",
    '<div class="quiz-choices">', asList(slide.choices).map((choice, index) => [
      '<button type="button" class="quiz-choice', answered && index === Number(slide.answer) ? " correct" : "", answered && index === selected && index !== Number(slide.answer) ? " wrong" : "",
      '" data-quiz-choice="', String(index), '" aria-pressed="', index === selected ? "true" : "false", '"', answered ? " disabled" : "", '><b>', String(index + 1), "</b><span>", escapeHtml(choice), "</span></button>"
    ].join("")).join(""), '</div><div class="quiz-feedback" id="quizFeedback" aria-live="polite">',
    answered
      ? escapeHtml((selected === Number(slide.answer) ? "정답입니다. " : "정답을 함께 표시했습니다. ") + String(slide.explanation || "핵심 개념을 다시 확인해 보세요."))
      : slide.type === "exit" ? "답을 선택하면 이 차시를 완료할 수 있어요." : "",
    "</div>",
    takeaways.length ? '<div class="exit-takeaways"><strong>오늘 가져갈 것</strong>' + renderBulletList(takeaways, "mini-list") + "</div>" : ""
  ].join("");
}

export function renderRichSlideContent(slide) {
  const typeLabels = {
    goals: "학습 목표",
    hook: "생각 열기",
    vocabulary: "핵심 어휘",
    concept: "개념 이해",
    example: "작동 예시",
    check: "형성평가",
    setup: "제작 준비",
    plan: "제작 계획",
    build: "따라 만들기",
    checkpoint: "작품 검증",
    troubleshoot: "오류 해결",
    differentiate: "수준별 활동",
    rubric: "평가 루브릭",
    exit: "마무리 평가",
    ai: "AI와 함께 만들기",
    activity: "학생 활동"
  };
  const badge = typeLabels[slide.type]
    ? '<div class="slide-type-badge">' + escapeHtml(typeLabels[slide.type]) + "</div>"
    : "";

  if (isQuizSlide(slide)) {
    return badge + renderQuizContent(slide);
  }
  if (slide.type === "goals") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="goal-grid"><article><strong>할 수 있어요</strong>', renderBulletList(slide.objectives, "mini-list"),
      '</article><article><strong>이렇게 확인해요</strong>', renderBulletList(slide.successCriteria, "mini-list"), "</article></div>"
    ].join("");
  }
  if (slide.type === "vocabulary") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="vocabulary-list">', asList(slide.terms).map((term) => [
        '<article class="vocabulary-item"><strong>', escapeHtml(term.term), "</strong><span>", escapeHtml(term.meaning),
        '</span><small>작품 예시 · ', escapeHtml(term.example), "</small></article>"
      ].join("")).join(""), "</div>"
    ].join("");
  }
  if (slide.type === "example") {
    const scenario = Array.isArray(slide.scenario) ? slide.scenario : [slide.scenario].filter(Boolean);
    const compare = slide.compare || {};
    const flow = [
      { label: "입력", values: slide.input },
      { label: "처리", values: slide.process },
      { label: "출력", values: slide.output }
    ].filter((item) => asList(item.values).length);
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      scenario.length ? '<div class="example-scenario"><b>상황</b>' + scenario.map((item) => "<span>" + escapeHtml(item) + "</span>").join("") + "</div>" : "",
      flow.length ? '<div class="example-flow">' + flow.map((item, index) => [
        '<article><b>', escapeHtml(item.label), "</b>", renderBulletList(item.values, "mini-list"), "</article>",
        index < flow.length - 1 ? '<span class="flow-arrow" aria-hidden="true">→</span>' : ""
      ].join("")).join("") + "</div>" : "",
      compare.good || compare.bad ? '<div class="compare-panel"><article class="good"><b>좋은 선택</b><span>' + escapeHtml(compare.good) +
        '</span></article><article class="bad"><b>피할 선택</b><span>' + escapeHtml(compare.bad) + "</span></article></div>" : "",
      asList(slide.body).length && slide.decisionQuestion ? '<div class="decision-criteria"><strong>판단 기준</strong>' + renderBulletList(slide.body, "mini-list") + "</div>" : "",
      slide.decisionQuestion ? '<div class="checkpoint-callout"><strong>선택 근거</strong><span>' + escapeHtml(slide.decisionQuestion) + "</span></div>" : ""
    ].join("");
  }
  if (slide.type === "setup") {
    return [badge, "<h2>", escapeHtml(slide.title), "</h2>", '<div class="setup-checklist">',
      asList(slide.checklist).map((item) => '<div><span>✓</span>' + escapeHtml(item) + "</div>").join(""), "</div>"].join("");
  }
  if (slide.type === "plan") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="plan-step-list">', asList(slide.steps).map((step, index) => '<div><b>' + String(index + 1) + "</b><span>" + escapeHtml(step) + "</span></div>").join(""), "</div>",
      '<div class="artifact-callout"><strong>남길 결과물</strong>', renderBulletList(slide.studentArtifacts, "mini-list"), "</div>"
    ].join("");
  }
  if (slide.type === "build") {
    return [
      '<div class="build-step-header"><span>제작 ', String(slide.stepNumber), " / ", String(slide.stepTotal), "</span><b>",
      escapeHtml(slide.codingType === "blockly" ? "MODI 블록" : slide.codingType === "hybrid" ? "Web + MODI" : "Web"), "</b></div>",
      "<h2>", escapeHtml(slide.title), "</h2>",
      '<ol class="step-instructions">', asList(slide.instructions).map((item) => "<li>" + escapeHtml(item) + "</li>").join(""), "</ol>",
      slide.prompt ? '<div class="prompt-callout"><strong>AI에게 이렇게 요청해 보세요</strong><code>' + escapeHtml(slide.prompt) + "</code></div>" : "",
      '<div class="checkpoint-callout"><strong>통과 조건</strong><span>', escapeHtml(slide.checkpoint), "</span></div>"
    ].join("");
  }
  if (slide.type === "checkpoint") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="checkpoint-grid"><article><strong>작동 확인</strong>', renderBulletList(slide.criteria, "mini-list"),
      '</article><article><strong>증거로 남기기</strong>', renderBulletList(slide.studentArtifacts, "mini-list"), "</article></div>",
      renderRubricTable(slide.rubric)
    ].join("");
  }
  if (slide.type === "troubleshoot") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="issue-table"><div class="issue-head"><b>보이는 증상</b><b>가능한 원인</b><b>확인·수정</b></div>',
      asList(slide.issues).map((issue) => '<article><span>' + escapeHtml(issue.symptom) + "</span><span>" + escapeHtml(issue.cause) + "</span><strong>" + escapeHtml(issue.fix) + "</strong></article>").join(""),
      "</div>"
    ].join("");
  }
  if (slide.type === "differentiate") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>",
      '<div class="differentiate-grid"><article><b>도움이 필요하면</b>', renderBulletList(slide.support, "mini-list"),
      '</article><article><b>먼저 완성했다면</b>', renderBulletList(slide.challenge, "mini-list"), "</article></div>"
    ].join("");
  }
  if (slide.type === "rubric") {
    return [
      badge, "<h2>", escapeHtml(slide.title), "</h2>", renderRubricTable(slide.rows),
      '<div class="artifact-callout"><strong>제출 증거</strong>', renderBulletList(slide.studentArtifacts, "mini-list"), "</div>"
    ].join("");
  }

  return [badge, "<h2>", escapeHtml(slide.title), "</h2>", renderBulletList(slide.body, "slide-body")].join("");
}

export function renderSlide() {
  const lesson = state.activeLesson;
  const slide = lesson.slides[state.slideIndex];
  const slideCard = document.getElementById("slideCard");
  slideCard.className = "slide-card type-" + escapeHtml(slide.type) + (slide.type === "title" ? " title-slide" : "") + (["ai", "build"].includes(slide.type) ? " ai-slide" : "") + (["activity", "checkpoint"].includes(slide.type) ? " activity-slide" : "");

  const phaseLine = '<div class="slide-phase">' + escapeHtml(slide.phase) + '<span>' + String(slide.minutes || 0) + "분</span></div>";
  let content = phaseLine;
  if (slide.type === "title") {
    content += "<h2>" + escapeHtml(slide.title) + "</h2><p class=\"slide-subtitle\">" + escapeHtml(slide.subtitle || "") + "</p>";
  } else {
    content += renderRichSlideContent(slide);
  }
  slideCard.innerHTML = content;
  const slideHeading = slideCard.querySelector("h2");
  if (slideHeading) {
    slideHeading.insertAdjacentHTML("afterend", renderLessonSlideVisual(getActiveCatalog().level, lesson, slide, state.slideIndex));
  }
  slideCard.scrollTop = 0;

  const note = document.getElementById("teacherNote");
  note.innerHTML = '<strong>교사 노트</strong>' + escapeHtml(slide.teacherNote || "이 단계에는 별도 교사 노트가 없습니다.");
  note.classList.toggle("open", state.teacherNoteOpen);

  const phases = ["도입", "전개", "정리"];
  document.getElementById("phaseTrack").innerHTML = phases.map((phase) => (
    '<span class="' + (phase === slide.phase ? "active" : "") + '">' + phase + "</span>"
  )).join("");

  document.getElementById("previousSlideButton").disabled = state.slideIndex === 0;
  const finalSlide = state.slideIndex === lesson.slides.length - 1;
  const exitAnswered = slide.type !== "exit" || Object.prototype.hasOwnProperty.call(state.quizAnswers, String(state.slideIndex));
  const nextButton = document.getElementById("nextSlideButton");
  nextButton.textContent = finalSlide ? "수업 완료" : "다음";
  nextButton.disabled = finalSlide && !exitAnswered;
  document.getElementById("slideCounter").textContent = String(state.slideIndex + 1) + " / " + String(lesson.slides.length);
  const progress = document.getElementById("slideProgress");
  progress.setAttribute("aria-valuemax", String(lesson.slides.length));
  progress.setAttribute("aria-valuenow", String(state.slideIndex + 1));
  progress.querySelector("span").style.width = String(((state.slideIndex + 1) / lesson.slides.length) * 100) + "%";
  document.getElementById("lessonLive").textContent = String(state.slideIndex + 1) + "단계, " + slide.title + ", " + slide.phase;
  renderSlideRail();
  renderStudio();
}

export function focusCurrentSlide() {
  const heading = document.querySelector("#slideCard h2");
  if (heading) {
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  }
}

export function moveSlide(direction) {
  if (!state.activeLesson) {
    return;
  }
  const next = state.slideIndex + direction;
  if (next < 0) {
    return;
  }
  if (next >= state.activeLesson.slides.length) {
    const currentSlide = state.activeLesson.slides[state.slideIndex];
    if (currentSlide.type === "exit" && !Object.prototype.hasOwnProperty.call(state.quizAnswers, String(state.slideIndex))) {
      showToast("마무리 문항에 답한 뒤 차시를 완료해 주세요.");
      const firstChoice = document.querySelector("[data-quiz-choice]");
      if (firstChoice) {
        firstChoice.focus();
      }
      return;
    }
    exitLesson(true);
    return;
  }
  state.slideIndex = next;
  renderSlide();
  focusCurrentSlide();
}

export function chooseQuiz(index) {
  const slide = state.activeLesson.slides[state.slideIndex];
  if (!isQuizSlide(slide)) {
    return;
  }
  state.quizAnswers[String(state.slideIndex)] = Number(index);
  document.querySelectorAll("[data-quiz-choice]").forEach((button) => {
    const choice = Number(button.dataset.quizChoice);
    button.classList.toggle("correct", choice === Number(slide.answer));
    button.classList.toggle("wrong", choice === Number(index) && choice !== Number(slide.answer));
    button.setAttribute("aria-pressed", choice === Number(index) ? "true" : "false");
    button.disabled = true;
  });
  const correct = Number(index) === Number(slide.answer);
  document.getElementById("quizFeedback").textContent = (correct ? "정답입니다. " : "정답을 함께 표시했습니다. ") + String(slide.explanation || "핵심 개념을 다시 확인해 보세요.");
  document.getElementById("nextSlideButton").disabled = false;
}
