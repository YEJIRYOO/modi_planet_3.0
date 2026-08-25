// MODI Planet LMS — 공용 DOM 참조와 HTML 조립 헬퍼.

export const main = document.getElementById("lmsMain");
export const planDialog = document.getElementById("planDialog");
export const planKicker = document.getElementById("planKicker");
export const planTitle = document.getElementById("planTitle");
export const planBody = document.getElementById("planBody");
export const lessonPlayer = document.getElementById("lessonPlayer");
export const learningStudio = document.getElementById("learningStudio");
export const studioToggle = document.getElementById("studioToggle");
export const studioBackdrop = document.getElementById("studioBackdrop");
export const mobileTeacherToggle = document.getElementById("mobileTeacherToggle");
export const toastElement = document.getElementById("toast");

export function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function asList(value) {
  return Array.isArray(value) ? value : [];
}

export function isQuizSlide(slide) {
  return ["quiz", "check", "exit"].includes(slide.type);
}

export function renderBulletList(items, className) {
  const values = asList(items);
  if (!values.length) {
    return "";
  }
  return '<ul class="' + escapeHtml(className || "slide-body") + '">' + values.map((item) => (
    "<li>" + escapeHtml(item) + "</li>"
  )).join("") + "</ul>";
}

export function renderRubricTable(rows) {
  const values = asList(rows);
  if (!values.length) {
    return "";
  }
  return [
    '<div class="rubric-wrap"><table class="rubric-table"><caption class="sr-only">평가 기준별 기초·도달·심화 수준</caption><thead><tr><th scope="col">평가 기준</th><th scope="col">기초</th><th scope="col">도달</th><th scope="col">심화</th></tr></thead><tbody>',
    values.map((row) => [
      '<tr><th scope="row">', escapeHtml(row.criterion), '</th><td data-label="기초">', escapeHtml(row.basic), '</td><td data-label="도달">',
      escapeHtml(row.proficient), '</td><td data-label="심화">', escapeHtml(row.advanced), "</td></tr>"
    ].join("")).join(""),
    "</tbody></table></div>"
  ].join("");
}

export function totalMinutes(lesson) {
  return asList(lesson.slides).reduce((sum, slide) => sum + Number(slide.minutes || 0), 0);
}

export function showToast(message) {
  toastElement.textContent = message;
  toastElement.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toastElement.classList.remove("show"), 2400);
}
