// MODI Planet LMS — 수업 플레이어 셸. 시작/종료, 타이머, 교사 노트.

import { renderCourse } from "./catalog.js";
import { lessonPlayer, mobileTeacherToggle, showToast } from "./dom.js";
import { closePlan } from "./plan.js";
import { renderSlide, renderSlideRail } from "./slides.js";
import { getActiveCatalog, getLevelMeta, lessonKey, saveProgress, state } from "./state.js";
import { closeStudio, syncStudioAccessibility } from "./studio.js";

export function setTeacherNoteOpen(next) {
  state.teacherNoteOpen = Boolean(next);
  [document.getElementById("teacherToggle"), mobileTeacherToggle].forEach((button) => {
    button.classList.toggle("active", state.teacherNoteOpen);
    button.setAttribute("aria-pressed", state.teacherNoteOpen ? "true" : "false");
  });
  document.getElementById("teacherNote").classList.toggle("open", state.teacherNoteOpen);
}

export function startLesson(lesson) {
  const catalog = getActiveCatalog();
  if (!catalog || !lesson) {
    return;
  }
  closePlan();
  state.activeLesson = lesson;
  state.slideIndex = 0;
  state.studioTab = "activity";
  state.previewSource = "preset";
  state.previewDemoActive = false;
  state.studioOpen = false;
  state.teacherNoteOpen = false;
  state.quizAnswers = {};
  state.checklistAnswers = {};
  state.lessonStartedAt = Date.now();
  state.chatMessages = [{ type: "assistant", text: "수업 활동의 예시 문장을 눌러 시작하거나, 만들고 싶은 내용을 직접 설명해 보세요." }];
  state.files = {};
  state.blocklyXml = "";
  state.modiModules = [];
  stopChat();
  document.body.classList.add("player-open");
  lessonPlayer.classList.add("open");
  lessonPlayer.setAttribute("aria-hidden", "false");
  if (!lessonPlayer.open) {
    lessonPlayer.showModal();
  }
  document.getElementById("playerMeta").textContent = getLevelMeta(catalog.level).difficulty + " · " + catalog.label + " " + catalog.subject + " · " + catalog.classMinutes + "분";
  document.getElementById("playerTitle").textContent = lesson.no + "차시 · " + lesson.title;
  setTeacherNoteOpen(false);
  syncStudioAccessibility();
  renderSlideRail();
  renderSlide();
  window.clearInterval(state.timerId);
  state.timerId = window.setInterval(updateTimer, 1000);
  updateTimer();
  document.getElementById("exitLessonButton").focus();
}

export function stopChat() {
  if (state.abortController) {
    state.abortController.abort();
    state.abortController = null;
  }
  state.streaming = false;
}

export function dismissLessonPlayer() {
  stopChat();
  window.clearInterval(state.timerId);
  state.timerId = null;
  lessonPlayer.classList.remove("open");
  lessonPlayer.setAttribute("aria-hidden", "true");
  closeStudio({ restoreFocus: false });
  if (lessonPlayer.open) {
    lessonPlayer.close();
  }
  if (document.fullscreenElement === lessonPlayer) {
    document.exitFullscreen().catch(() => {});
  }
  document.body.classList.remove("player-open");
  lessonPlayer.classList.remove("assigned-lesson-player");
  state.activeLesson = null;
}

export function openAssignedLesson(lesson) {
  lessonPlayer.classList.add("assigned-lesson-player");
  startLesson(lesson);
  if (lessonPlayer.requestFullscreen) {
    lessonPlayer.requestFullscreen().catch(() => {
      showToast("브라우저 전체화면을 허용하면 강의안을 더 크게 볼 수 있어요.");
    });
  }
}

export function exitLesson(completed) {
  if (!state.activeLesson) {
    return;
  }
  const catalog = getActiveCatalog();
  const lessonNumber = state.activeLesson.no;
  if (completed) {
    state.progress[lessonKey(catalog.level, state.activeLesson.no)] = {
      completedAt: new Date().toISOString(),
      title: state.activeLesson.title
    };
    saveProgress();
  }
  dismissLessonPlayer();
  renderCourse();
  window.requestAnimationFrame(() => {
    const startButton = document.querySelector('[data-start-lesson="' + String(lessonNumber) + '"]');
    if (startButton) {
      startButton.focus({ preventScroll: true });
    }
  });
  showToast(completed ? "차시를 완료했어요. 진도가 저장되었습니다." : "수업 화면을 닫았습니다.");
}

export function updateTimer() {
  const catalog = getActiveCatalog();
  if (!catalog || !state.activeLesson) {
    return;
  }
  const elapsed = Math.max(0, Math.floor((Date.now() - state.lessonStartedAt) / 1000));
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  const timer = document.getElementById("classTimer");
  timer.innerHTML = "<span>" + minutes + ":" + seconds + '</span><span class="class-duration"> · ' + String(catalog.classMinutes) + "분</span>";
  timer.classList.toggle("warning", elapsed >= Math.max(0, catalog.classMinutes - 5) * 60);
}
