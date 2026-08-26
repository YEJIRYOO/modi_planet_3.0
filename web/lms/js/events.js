// MODI Planet LMS — 전역 이벤트 위임과 요소 배선.

import { renderCourse } from "./catalog.js";
import { openBadgeCollection, openCreateClass, openJoinClass, openStudentMonitor, openSubmissionComplete, openSubmitPanel, openWorkDetail, renderClassDetail, renderClassroom, renderStudentClassDetail, updateRosterView } from "./classroom.js";
import { CLASSROOM_KEY, CLASSROOM_MOCK } from "./config.js";
import { asList, learningStudio, lessonPlayer, main, mobileTeacherToggle, planDialog, showToast, studioBackdrop, studioToggle } from "./dom.js";
import { closePlan, openPlan } from "./plan.js";
import { exitLesson, openAssignedLesson, setTeacherNoteOpen, startLesson } from "./player.js";
import { getPreviewExample, handlePreviewPointerMove, handlePreviewPointerOut } from "./preview.js";
import { boot, route } from "./routes.js";
import { chooseQuiz, focusCurrentSlide, moveSlide, renderSlide } from "./slides.js";
import { findLesson, state } from "./state.js";
import { closeStudio, openStudio, renderStudio, setStudioTab, syncStudioAccessibility, usesMobileStudio } from "./studio.js";
import { sendTutorMessage, usePrompt } from "./tutor.js";

document.addEventListener("click", (event) => {
  const assignedLesson = event.target.closest("[data-assigned-lesson]");
  if (assignedLesson) {
    openAssignedLesson(findLesson(assignedLesson.dataset.assignedLesson));
    return;
  }

  const studentClass = event.target.closest("[data-student-class]");
  if (studentClass) {
    renderStudentClassDetail(studentClass.dataset.studentClass);
    return;
  }

  const classTab = event.target.closest("[data-class-tab]");
  if (classTab) {
    renderClassDetail(classTab.dataset.classTab);
    return;
  }

  const studentMonitor = event.target.closest("[data-student-monitor]");
  if (studentMonitor) {
    openStudentMonitor(studentMonitor.dataset.studentMonitor);
    return;
  }

  const classAction = event.target.closest("[data-class-action]");
  if (classAction) {
    const action = classAction.dataset.classAction;
    const messages = {
      "copy-invite": "초대코드 MODI-52를 복사했어요.", "invite-link": "무계정 참여 링크를 준비했어요.",
      "refresh": "학생 활동 이벤트를 새로 불러왔어요.", "refresh-student": "최근 저장 작업을 불러왔어요.",
      "start-class": "4차시 수업을 시작할 준비가 됐어요.", "announcement": "학급 공지 작성 화면을 열었어요.",
      "download-report": "학급 작품 리포트를 준비했어요.", "add-student": "학생 등록 링크와 초대코드를 열었어요.",
      "save-curriculum": "별빛 메이커 5-2 수업 편성을 저장했어요.", "save-note": "학생 관찰 메모를 저장했어요.",
      "send-hint": "학생 활동실에 생각 힌트를 보냈어요.", "call-student": "도움 필요 목록에 표시했어요."
    };
    if (action === "lesson-plan") window.location.hash = "#elementary";
    else showToast(messages[action] || "학급 정보를 업데이트했어요.");
    return;
  }

  const roleButton = event.target.closest("[data-classroom-role]");
  if (roleButton) {
    localStorage.setItem(CLASSROOM_KEY + "-role", roleButton.dataset.classroomRole);
    renderClassroom();
    return;
  }

  const officeAction = event.target.closest("[data-office-action]");
  if (officeAction) {
    const action = officeAction.dataset.officeAction;
    if (action === "back") renderClassroom();
    else if (action === "curriculum") window.location.hash = "#elementary";
    else if (action === "new-class") openCreateClass();
    else if (action === "class" && ["c1", "c-new"].includes(officeAction.dataset.classId)) renderClassDetail(officeAction.dataset.classId === "c-new" ? "curriculum" : "overview");
    else if (action === "class") showToast("창의융합 방과후 상세 mock은 다음 반으로 준비 중이에요.");
    else if (action === "report") showToast("3차시 수업 리포트를 불러왔어요.");
    return;
  }

  const studentAction = event.target.closest("[data-student-action]");
  if (studentAction) {
    const action = studentAction.dataset.studentAction;
    if (action === "submit") openSubmitPanel();
    else if (action === "class-list") renderClassroom();
    else if (action === "back") renderStudentClassDetail(localStorage.getItem(CLASSROOM_KEY + "-student-class") || "c1");
    else if (action === "continue") window.location.hash = "#elementary";
    else if (action === "confirm-submit") openSubmissionComplete();
    else if (action === "work") openWorkDetail(studentAction.dataset.workId);
    else if (action === "badges") openBadgeCollection();
    else if (action === "join") openJoinClass();
    else if (action === "ask-tutor") showToast("힌트: 신호가 바뀌는 동안 보행자는 무엇을 듣거나 볼 수 있을까요?");
    else if (action === "play") showToast("작동 영상 재생: 버튼 입력 → 빨강 → 노랑 → 초록");
    else if (action === "certificate") showToast("인증서를 저장할 준비가 되었어요.");
    return;
  }

  const levelButton = event.target.closest("[data-level]");
  if (levelButton) {
    window.location.hash = "#" + levelButton.dataset.level;
    return;
  }

  const allLevelsButton = event.target.closest("[data-action='all-levels']");
  if (allLevelsButton) {
    window.location.hash = "#levels";
    return;
  }

  const retryButton = event.target.closest("[data-action='retry']");
  if (retryButton) {
    main.innerHTML = '<div class="app-loading" role="status"><span class="loader"></span><strong>다시 불러오고 있어요</strong></div>';
    boot();
    return;
  }

  const filterButton = event.target.closest("[data-mode-filter]");
  if (filterButton) {
    state.modeFilter = filterButton.dataset.modeFilter;
    renderCourse();
    window.requestAnimationFrame(() => {
      const activeFilter = document.querySelector('[data-mode-filter="' + state.modeFilter + '"]');
      if (activeFilter) {
        activeFilter.focus({ preventScroll: true });
        activeFilter.scrollIntoView({ block: "nearest", inline: "center" });
      }
    });
    return;
  }

  const planButton = event.target.closest("[data-plan-lesson]");
  if (planButton) {
    openPlan(findLesson(planButton.dataset.planLesson));
    return;
  }

  const startButton = event.target.closest("[data-start-lesson]");
  if (startButton) {
    startLesson(findLesson(startButton.dataset.startLesson));
    return;
  }

  const slideButton = event.target.closest("[data-slide-index]");
  if (slideButton && state.activeLesson) {
    state.slideIndex = Number(slideButton.dataset.slideIndex);
    renderSlide();
    focusCurrentSlide();
    return;
  }

  const quizButton = event.target.closest("[data-quiz-choice]");
  if (quizButton) {
    chooseQuiz(Number(quizButton.dataset.quizChoice));
    return;
  }

  const studioTabButton = event.target.closest("[data-studio-tab]");
  if (studioTabButton) {
    setStudioTab(studioTabButton.dataset.studioTab);
    return;
  }

  const previewSourceButton = event.target.closest("[data-preview-source]");
  if (previewSourceButton && state.activeLesson) {
    state.previewSource = previewSourceButton.dataset.previewSource;
    state.previewDemoActive = false;
    renderStudio();
    window.requestAnimationFrame(() => {
      const activeButton = document.querySelector('[data-preview-source="' + state.previewSource + '"]');
      if (activeButton) {
        activeButton.focus({ preventScroll: true });
      }
    });
    return;
  }

  const previewActionButton = event.target.closest("[data-preview-action]");
  if (previewActionButton && state.activeLesson) {
    if (previewActionButton.dataset.previewAction === "demo") {
      state.previewDemoActive = !state.previewDemoActive;
      renderStudio();
      window.requestAnimationFrame(() => {
        const demoButton = document.querySelector('[data-preview-action="demo"]');
        if (demoButton) {
          demoButton.focus({ preventScroll: true });
        }
      });
    } else if (previewActionButton.dataset.previewAction === "start") {
      const example = getPreviewExample(state.activeLesson);
      const suggestedPrompt = asList(state.activeLesson.slides).flatMap((slide) => asList(slide.prompts))[0]
        || example.scenario
        || state.activeLesson.summary;
      setStudioTab("activity");
      usePrompt(String(suggestedPrompt || ""));
    }
    return;
  }

  const promptButton = event.target.closest("[data-prompt]");
  if (promptButton) {
    usePrompt(promptButton.dataset.prompt);
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-roster-filter]")) {
    updateRosterView();
    return;
  }
  if (event.target.matches("[data-self-check]")) {
    const required = Array.from(document.querySelectorAll('[data-self-check="0"], [data-self-check="1"], [data-self-check="2"]'));
    const submitButton = document.querySelector('[data-student-action="confirm-submit"]');
    if (submitButton) {
      submitButton.disabled = required.some((checkbox) => !checkbox.checked);
    }
    return;
  }
  const checkpoint = event.target.closest("[data-checkpoint]");
  if (!checkpoint || !state.activeLesson) {
    return;
  }
  const key = String(state.slideIndex);
  const current = new Set(asList(state.checklistAnswers[key]));
  const index = Number(checkpoint.dataset.checkpoint);
  if (checkpoint.checked) {
    current.add(index);
  } else {
    current.delete(index);
  }
  state.checklistAnswers[key] = Array.from(current);
});

document.addEventListener("input", (event) => {
  if (event.target.matches("[data-roster-search]")) updateRosterView();
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "createClassForm") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const className = String(formData.get("className") || "새 반").trim();
    localStorage.setItem(CLASSROOM_KEY + "-created-class", className);
    showToast(className + " 반을 만들었어요. 초대코드 MODI-53이 생성됐습니다.");
    window.setTimeout(renderClassroom, 650);
    return;
  }
  if (event.target.id !== "joinClassForm") return;
  event.preventDefault();
  const formData = new FormData(event.target);
  const invite = String(formData.get("invite") || "").trim().toUpperCase();
  const nickname = String(formData.get("nickname") || "").trim();
  if (invite !== CLASSROOM_MOCK.student.invite) {
    showToast("초대코드를 다시 확인해 주세요. 데모 코드는 MODI-52예요.");
    event.target.querySelector('[name="invite"]').focus();
    return;
  }
  CLASSROOM_MOCK.student.nickname = nickname || "하늘이";
  localStorage.setItem(CLASSROOM_KEY + "-joined", invite);
  const sessionId = localStorage.getItem(CLASSROOM_KEY + "-session-id") || "STU-" + crypto.randomUUID().slice(0, 8).toUpperCase();
  localStorage.setItem(CLASSROOM_KEY + "-session-id", sessionId);
  localStorage.setItem(CLASSROOM_KEY + "-student-name", nickname);
  showToast("별빛 메이커 5-2 반에 참여했어요. 세션 ID: " + sessionId);
  window.setTimeout(renderClassroom, 650);
});

document.getElementById("closePlanButton").addEventListener("click", closePlan);
document.getElementById("closePlanFooterButton").addEventListener("click", closePlan);
document.getElementById("startFromPlanButton").addEventListener("click", () => startLesson(state.planLesson));
document.getElementById("exitLessonButton").addEventListener("click", () => exitLesson(false));
document.getElementById("previousSlideButton").addEventListener("click", () => moveSlide(-1));
document.getElementById("nextSlideButton").addEventListener("click", () => moveSlide(1));
document.getElementById("teacherToggle").addEventListener("click", () => setTeacherNoteOpen(!state.teacherNoteOpen));
mobileTeacherToggle.addEventListener("click", () => setTeacherNoteOpen(!state.teacherNoteOpen));
studioToggle.addEventListener("click", () => state.studioOpen ? closeStudio() : openStudio());
document.getElementById("closeStudioButton").addEventListener("click", () => closeStudio());
studioBackdrop.addEventListener("click", () => closeStudio());

document.getElementById("tutorForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.getElementById("tutorInput");
  const message = input.value.trim();
  if (!message) {
    return;
  }
  if (state.streaming) {
    showToast("AI 응답이 끝난 뒤 다음 요청을 보내 주세요.");
    return;
  }
  input.value = "";
  sendTutorMessage(message);
});

document.getElementById("tutorInput").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing && event.keyCode !== 229) {
    event.preventDefault();
    document.getElementById("tutorForm").requestSubmit();
  }
});

document.querySelector(".studio-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }
  const tabs = Array.from(document.querySelectorAll("[data-studio-tab]"));
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) {
    return;
  }
  event.preventDefault();
  const next = event.key === "Home" ? 0
    : event.key === "End" ? tabs.length - 1
      : (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
  setStudioTab(tabs[next].dataset.studioTab);
  tabs[next].focus();
});

learningStudio.addEventListener("pointermove", handlePreviewPointerMove);

learningStudio.addEventListener("pointerout", handlePreviewPointerOut);

learningStudio.addEventListener("keydown", (event) => {
  const previewSourceTab = event.target.closest("[data-preview-source]");
  if (previewSourceTab && ["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    event.preventDefault();
    const sources = ["preset", "mine"];
    const current = sources.indexOf(previewSourceTab.dataset.previewSource);
    const next = event.key === "Home" ? 0
      : event.key === "End" ? sources.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + sources.length) % sources.length;
    state.previewSource = sources[next];
    state.previewDemoActive = false;
    renderStudio();
    window.requestAnimationFrame(() => {
      const nextTab = document.querySelector('[data-preview-source="' + state.previewSource + '"]');
      if (nextTab) {
        nextTab.focus({ preventScroll: true });
      }
    });
    return;
  }
  if (event.key !== "Tab" || !state.studioOpen || !usesMobileStudio()) {
    return;
  }
  const focusable = Array.from(learningStudio.querySelectorAll("button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])"))
    .filter((element) => element.getClientRects().length > 0 && element.getAttribute("aria-hidden") !== "true");
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.addEventListener("keydown", (event) => {
  if (!state.activeLesson || event.target.matches("textarea, input, button")) {
    return;
  }
  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    moveSlide(1);
  } else if (event.key === "ArrowLeft") {
    moveSlide(-1);
  } else if (event.key.toLowerCase() === "t") {
    document.getElementById("teacherToggle").click();
  }
});

lessonPlayer.addEventListener("cancel", (event) => {
  event.preventDefault();
  if (state.studioOpen && usesMobileStudio()) {
    closeStudio();
    return;
  }
  exitLesson(false);
});

planDialog.addEventListener("click", (event) => {
  if (event.target === planDialog) {
    closePlan();
  }
});

window.addEventListener("resize", () => {
  if (!usesMobileStudio()) {
    state.studioOpen = false;
  }
  syncStudioAccessibility();
});

window.addEventListener("hashchange", route);
