// MODI Planet LMS — 차시 교안 다이얼로그.

import { asList, escapeHtml, isQuizSlide, planBody, planDialog, planKicker, planTitle, renderBulletList, renderRubricTable, totalMinutes } from "./dom.js";
import { getActiveCatalog, getLevelMeta, state } from "./state.js";

export function openPlan(lesson) {
  const catalog = getActiveCatalog();
  state.planLesson = lesson;
  planKicker.textContent = getLevelMeta(catalog.level).difficulty + " · " + catalog.label + " " + catalog.subject + " · " + totalMinutes(lesson) + "분";
  planTitle.textContent = lesson.no + "차시 · " + lesson.title;

  const assessments = [];
  asList(lesson.slides).forEach((slide) => {
    if (isQuizSlide(slide)) {
      assessments.push({
        title: slide.type === "exit" ? "마무리 평가" : "형성평가",
        text: slide.question + " · 정답: " + asList(slide.choices)[slide.answer] + " · " + slide.explanation
      });
    } else if (slide.type === "checkpoint") {
      asList(slide.criteria).forEach((criterion) => assessments.push({ title: "성공 기준", text: criterion }));
    } else if (slide.type === "build" && slide.checkpoint) {
      assessments.push({ title: "제작 " + slide.stepNumber + "단계", text: slide.checkpoint });
    }
  });

  planBody.innerHTML = [
    '<p class="plan-summary">', escapeHtml(lesson.summary), "</p>",
    '<div class="plan-columns">',
    '<section class="plan-section"><h3>학습 목표</h3><ul>', asList(lesson.objectives).map((objective) => "<li>" + escapeHtml(objective) + "</li>").join(""), "</ul></section>",
    '<section class="plan-section"><h3>성공 기준</h3><ul>', asList(lesson.successCriteria).map((criterion) => "<li>" + escapeHtml(criterion) + "</li>").join(""), "</ul></section>",
    '<section class="plan-section"><h3>준비물</h3><ul>', asList(lesson.materials).map((material) => "<li>" + escapeHtml(material) + "</li>").join(""), "</ul></section>",
    '<section class="plan-section"><h3>학생 산출물</h3><ul>', asList(lesson.studentArtifacts).map((artifact) => "<li>" + escapeHtml(artifact) + "</li>").join(""), "</ul></section>",
    '<section class="plan-section full"><h3>핵심 어휘와 수업 예시</h3><div class="vocabulary-list compact">', asList(lesson.vocabulary).map((term) => [
      '<article class="vocabulary-item"><strong>', escapeHtml(term.term), "</strong><span>", escapeHtml(term.meaning),
      '</span><small>예: ', escapeHtml(term.example), "</small></article>"
    ].join("")).join(""), "</div></section>",
    '<section class="plan-section full"><h3>연계 성취기준</h3><div class="standard-blocks">', asList(lesson.standards).map((standard) => [
      '<div class="standard-block"><strong>', escapeHtml(standard.code), "</strong>", escapeHtml(standard.text), "</div>"
    ].join("")).join(""), "</div></section>",
    '<section class="plan-section full"><h3>차시별 수업 흐름 · 총 ', String(totalMinutes(lesson)), "분 · ", String(asList(lesson.slides).length), '페이지</h3><div class="lesson-timeline">',
    asList(lesson.slides).map((slide) => [
      '<div class="timeline-row"><span class="phase">', escapeHtml(slide.phase), "</span><strong>", escapeHtml(slide.title),
      '</strong><span class="minutes">', String(slide.minutes || 0), "분</span></div>"
    ].join("")).join(""), "</div></section>",
    '<section class="plan-section full"><h3>수준별 운영</h3><div class="differentiate-grid compact"><article><b>도움이 필요할 때</b>',
    renderBulletList(lesson.differentiation && lesson.differentiation.support, "mini-list"),
    '</article><article><b>더 도전할 때</b>', renderBulletList(lesson.differentiation && lesson.differentiation.challenge, "mini-list"), "</article></div></section>",
    '<section class="plan-section full"><h3>평가 루브릭</h3>', renderRubricTable(lesson.rubric), "</section>",
    '<section class="plan-section full"><h3>평가와 체크포인트</h3><div class="assessment-list">',
    assessments.map((assessment) => '<div class="assessment-item"><b>' + escapeHtml(assessment.title) + "</b>" + escapeHtml(assessment.text) + "</div>").join(""),
    "</div></section></div>"
  ].join("");

  planBody.scrollTop = 0;
  planDialog.showModal();
}

export function closePlan() {
  if (planDialog.open) {
    planDialog.close();
  }
}
