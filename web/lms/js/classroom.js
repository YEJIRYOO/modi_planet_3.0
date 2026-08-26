// MODI Planet LMS — 나의 교실. 교사 오피스와 학생 교실.

import { CLASSROOM_KEY, CLASSROOM_MOCK, MODES } from "./config.js";
import { escapeHtml, main } from "./dom.js";
import { getCatalog } from "./state.js";

export function classroomRole() {
  return localStorage.getItem(CLASSROOM_KEY + "-role") || CLASSROOM_MOCK.role;
}

export function renderRoleSwitch(role) {
  return '<div class="role-switch" role="group" aria-label="화면 역할 전환"><button type="button" data-classroom-role="student" class="' + (role === "student" ? "active" : "") + '">학생 · 나의 교실</button><button type="button" data-classroom-role="teacher" class="' + (role === "teacher" ? "active" : "") + '">교사 · 내 교무실</button></div>';
}

export function renderClassroom() {
  const role = classroomRole();
  main.innerHTML = role === "teacher" ? renderTeacherOffice() : renderStudentClassroom();
  document.title = (role === "teacher" ? "내 교무실" : "나의 교실") + " · MODI Planet";
}

export function renderTeacherOffice() {
  const classes = CLASSROOM_MOCK.classes;
  return [
    '<div class="classroom-page teacher-office">',
    '<header class="classroom-hero"><div><p class="classroom-kicker">TEACHER OFFICE</p><h1>안녕하세요, 김모디 선생님</h1><p>작품이 완성되는 순간을 놓치지 않도록 오늘의 수업과 평가를 모았어요.</p></div>', renderRoleSwitch("teacher"), '</header>',
    '<section class="office-alert"><span class="pulse-dot"></span><div><b>오늘 확인할 작품 7개</b><p>AI 평가 초안은 제안일 뿐이에요. 선생님이 확인하고 확정하면 학생에게 전달됩니다.</p></div><button type="button" data-office-action="review">채점 대기열 보기 →</button></section>',
    '<div class="office-grid"><section class="office-main"><div class="section-heading"><div><span>MY CLASSES</span><h2>내 학급</h2></div><button class="soft-button" type="button" data-office-action="new-class">＋ 새 학급</button></div>',
    '<div class="class-cards">', classes.map((item, index) => '<article class="class-card class-card-tone-' + ((index % 3) + 1) + '"><div class="class-card-top"><span>' + escapeHtml(item.grade) + '</span><button type="button" aria-label="' + escapeHtml(item.name) + ' 더보기">•••</button></div><h3>' + escapeHtml(item.name) + '</h3><div class="class-signal"><b>' + item.active + '</b><span>명의 학생이<br>작품을 만들고 있어요</span></div><dl><div><dt>학생</dt><dd>' + item.students + '명</dd></div><div><dt>확인 대기</dt><dd class="accent">' + item.pending + '개</dd></div></dl><footer><span>' + escapeHtml(item.next) + '</span><button type="button" data-office-action="class" data-class-id="' + escapeHtml(item.id) + '">반 열기 →</button></footer></article>').join(''), '</div></section>',
    '<aside class="office-side"><section class="queue-card"><div class="section-heading"><div><span>REVIEW QUEUE</span><h2>채점·확정 대기</h2></div><b class="count-badge">7</b></div><div class="submission-list">', CLASSROOM_MOCK.submissions.map((item, index) => '<button type="button" data-review-index="' + index + '"><span class="work-thumb ' + item.color + '">⚙</span><span><b>' + escapeHtml(item.student) + '</b><small>' + escapeHtml(item.work) + '</small><em>' + escapeHtml(item.time) + '</em></span><i>' + escapeHtml(item.status) + '</i></button>').join(''), '</div><button class="full-soft-button" type="button" data-office-action="review">전체 대기열 보기</button></section>',
    '</aside></div></div>'
  ].join('');
}

export function renderClassTabs(active) {
  return '<nav class="class-detail-tabs" aria-label="학급 관리 메뉴">' + [
    ["overview", "오늘의 반"], ["roster", "학생 명단"], ["curriculum", "My Curriculum · 수업 편성"], ["settings", "AI Tutor Control · 힌트 설정"]
  ].map((tab) => '<button type="button" data-class-tab="' + tab[0] + '" class="' + (active === tab[0] ? 'active' : '') + '">' + tab[1] + '</button>').join('') + '</nav>';
}

export function renderClassDetail(tab) {
  const activeTab = tab || "overview";
  const classInfo = CLASSROOM_MOCK.classes[0];
  let body = "";
  if (activeTab === "roster") body = renderRosterPanel();
  else if (activeTab === "curriculum") body = renderClassCurriculum();
  else if (activeTab === "settings") body = renderClassTutorSettings();
  else body = renderClassOverview();
  main.innerHTML = [
    '<div class="classroom-page class-detail-page"><button class="back-link" type="button" data-office-action="back">← 내 교무실</button>',
    '<header class="class-detail-header"><div><p class="classroom-kicker">MY CLASS · ', escapeHtml(classInfo.grade), '</p><h1>', escapeHtml(classInfo.name), '</h1><p>담임 김모디 · 학생 ', classInfo.students, '명 · 2026학년도 2학기</p></div>',
    '<div class="invite-box"><span>학생 초대코드</span><b>', escapeHtml(classInfo.invite), '</b><button type="button" data-class-action="copy-invite">복사</button><button type="button" data-class-action="invite-link">초대 링크</button></div></header>',
    renderClassTabs(activeTab), '<div class="class-tab-body">', body, '</div></div>'
  ].join('');
  document.title = classInfo.name + " · 내 교무실";
}

export function renderClassOverview() {
  const roster = CLASSROOM_MOCK.roster;
  const counts = {
    submitted: roster.filter((student) => student.state === "submitted").length,
    building: roster.filter((student) => student.state === "building").length,
    help: roster.filter((student) => student.state === "help").length
  };
  return [
    '<section class="class-session-banner"><div><span>다음 수업 · 8월 27일 목요일 10:40</span><h2>4차시 · 보행자 신호 회로</h2><p>버튼 → 네트워크 → LED 신호 흐름을 만들고 작동 증거를 남겨요.</p></div><div class="session-actions"><button type="button" data-class-action="lesson-plan">교안 보기</button><button class="primary" type="button" data-class-action="start-class">수업 시작</button></div></section>',
    '<div class="class-overview-grid"><section class="live-board"><div class="section-heading"><div><span>ACTIVITY SNAPSHOT</span><h2>학생 작품 상태</h2></div><div class="snapshot-time"><i></i><span>방금 새로고침</span><button type="button" data-class-action="refresh">↻</button></div></div>',
    '<div class="making-stats"><article><span class="stat-icon coral">✓</span><div><b>', counts.submitted, '</b><small>제출 완료</small></div></article><article><span class="stat-icon blue">⚙</span><div><b>', counts.building, '</b><small>만드는 중</small></div></article><article><span class="stat-icon amber">!</span><div><b>', counts.help, '</b><small>도움 필요</small></div></article><article><span class="stat-icon gray">○</span><div><b>18</b><small>오늘 참여</small></div></article></div>',
    '<div class="cost-note"><span>저비용 모니터링</span><p>학생 화면을 계속 스트리밍하지 않고, 저장·연결·제출 이벤트만 모아 보여줘요.</p></div>',
    '<div class="student-snapshot-list">', roster.slice(0, 4).map(renderStudentSnapshot).join(''), '</div><button class="full-soft-button" type="button" data-class-tab="roster">24명 전체 보기</button></section>',
    '<aside class="class-today-side"><section class="attention-card"><span>TEACHER ATTENTION</span><h2>먼저 살펴볼 학생</h2><button type="button" data-student-monitor="s4"><div class="student-avatar amber">최</div><span><b>최민준</b><small>MODI 연결 5회 실패</small></span><i>도움 필요</i></button><button type="button" data-student-monitor="s3"><div class="student-avatar violet">박</div><span><b>박서아</b><small>피드백 후 재제출 준비</small></span><i>확인</i></button></section>',
    '<section class="today-evidence"><span>SUBMISSION QUEUE</span><h2>새로 도착한 작품</h2><div><b>김하늘 · 교통 신호등</b><p>코드 12블록 · 모듈 3개 · 영상 00:18</p><button type="button" data-review-index="0">평가 초안 확인 →</button></div></section>',
    '<section class="class-quick-actions"><span>QUICK ACTIONS</span><h2>학급 운영</h2><button type="button" data-class-tab="curriculum">＋ 차시 배정하기</button><button type="button" data-class-action="announcement">공지 보내기</button><button type="button" data-class-action="download-report">학급 리포트</button></section></aside></div>'
  ].join('');
}

export function renderStudentSnapshot(student) {
  return '<button type="button" data-student-monitor="' + escapeHtml(student.id) + '"><span class="student-avatar ' + escapeHtml(student.state) + '">' + escapeHtml(student.name.charAt(0)) + '</span><span class="snapshot-name"><b>' + escapeHtml(student.name) + '</b><small>' + escapeHtml(student.alias) + '</small></span><span class="snapshot-work"><b>' + escapeHtml(student.stateLabel) + '</b><small>' + escapeHtml(student.evidence) + '</small></span><span class="module-mini">' + (student.modules.length ? student.modules.map((module) => '<i>' + escapeHtml(module.charAt(0)) + '</i>').join('') : '<em>연결 전</em>') + '</span><time>' + escapeHtml(student.updated) + '</time><i class="row-arrow">›</i></button>';
}

export function renderRosterPanel() {
  return '<section class="roster-panel"><div class="roster-toolbar"><div><span>CLASS ROSTER</span><h2>학생 24명</h2></div><div><label class="roster-search">⌕ <input type="search" placeholder="학생 이름 검색" data-roster-search></label><select data-roster-filter><option value="all">전체 상태</option><option value="submitted">제출 완료</option><option value="building">만드는 중</option><option value="help">도움 필요</option></select><button type="button" data-class-action="add-student">＋ 학생 등록</button></div></div><div class="roster-table-head"><span>학생</span><span>현재 작품</span><span>작품 상태</span><span>MODI 구성</span><span>최근 활동</span><span></span></div><div class="roster-table" id="rosterTable">' + CLASSROOM_MOCK.roster.map(renderStudentSnapshot).join('') + '</div><div class="mock-roster-rest">외 18명의 학생 mock 로스터가 등록되어 있습니다.</div></section>';
}

export function updateRosterView() {
  const table = document.getElementById("rosterTable");
  if (!table) return;
  const query = String(document.querySelector("[data-roster-search]")?.value || "").trim().toLowerCase();
  const filter = document.querySelector("[data-roster-filter]")?.value || "all";
  const matches = CLASSROOM_MOCK.roster.filter((student) => (filter === "all" || student.state === filter) && (!query || student.name.toLowerCase().includes(query) || student.alias.toLowerCase().includes(query)));
  table.innerHTML = matches.length ? matches.map(renderStudentSnapshot).join("") : '<div class="roster-empty">조건에 맞는 학생이 없어요.</div>';
}

export function renderClassCurriculum() {
  const assigned = new Set(CLASSROOM_MOCK.lessons.map((lesson) => lesson.no));
  return '<section class="class-curriculum-panel"><header><div><span>CLASS CURRICULUM</span><h2>27차시에서 우리 반 수업 편성</h2><p>현재 교육과정의 차시를 골라 날짜와 과제로 배정해요.</p></div><button type="button" data-class-action="save-curriculum">편성 저장</button></header><div class="curriculum-columns"><section><h3>이번 학기 배정됨 <b>3</b></h3>' + CLASSROOM_MOCK.lessons.map((lesson, index) => '<article class="assigned-lesson"><i>' + (index + 1) + '</i><div><small>' + escapeHtml(lesson.date) + ' · ' + escapeHtml(lesson.type) + '</small><b>' + lesson.no + '차시 · ' + escapeHtml(lesson.title) + '</b></div><span>' + escapeHtml(lesson.state) + '</span><button type="button" aria-label="순서 이동">↕</button></article>').join('') + '</section><aside><h3>초급 · 초등 9차시</h3>' + getCatalog("elementary").lessons.map((lesson) => '<label class="catalog-pick"><input type="checkbox" data-curriculum-pick="' + lesson.no + '" ' + (assigned.has(lesson.no) ? 'checked' : '') + '><span><small>' + escapeHtml(MODES[lesson.projectType].label) + '</small><b>' + lesson.no + '차시 · ' + escapeHtml(lesson.title) + '</b></span></label>').join('') + '</aside></div></section>';
}

export function renderClassTutorSettings() {
  return '<section class="class-settings-panel"><header><span>AI TUTOR POLICY</span><h2>별빛 메이커 5-2 힌트 정책</h2><p>학생이 스스로 생각할 여백을 남기면서, 막힌 순간에는 다음 행동을 찾도록 도와요.</p></header><div class="setting-grid"><section><h3>힌트 강도</h3><div class="hint-choice"><label><input type="radio" name="hint" value="question"><span><b>질문만</b><small>생각할 질문만 제시</small></span></label><label><input type="radio" name="hint" value="thinking" checked><span><b>생각 열기</b><small>확인할 지점까지 안내</small></span></label><label><input type="radio" name="hint" value="steps"><span><b>단계 안내</b><small>다음 한 단계를 제시</small></span></label></div></section><section><h3>정답 노출</h3><label class="policy-toggle"><span><b>완성 코드 노출 제한</b><small>전체 정답 대신 부분 예시만 허용</small></span><input type="checkbox" checked></label><label class="policy-toggle"><span><b>3회 시도 후 추가 힌트</b><small>실패 기록이 있을 때만 단계 안내</small></span><input type="checkbox" checked></label><label class="policy-toggle"><span><b>교사 호출 연결</b><small>연결 오류가 반복되면 도움 목록에 표시</small></span><input type="checkbox" checked></label></section><section class="policy-preview"><span>STUDENT PREVIEW</span><h3>학생에게는 이렇게 보여요</h3><div><b>AI 튜터</b><p>LED가 켜지지 않는군요. 먼저 BUTTON과 LED 사이에 NETWORK 모듈이 연결되어 있는지 확인해 볼까요?</p><small>완성 코드는 보여주지 않았어요 · 생각 열기 힌트</small></div></section></div><footer><button type="button" data-class-action="reset-settings">기본값으로</button><button class="primary" type="button" data-class-action="save-settings">우리 반 설정 저장</button></footer></section>';
}

export function openStudentMonitor(id) {
  const student = CLASSROOM_MOCK.roster.find((item) => item.id === id) || CLASSROOM_MOCK.roster[0];
  main.innerHTML = '<div class="classroom-page monitor-page"><button class="back-link" type="button" data-class-tab="overview">← 별빛 메이커 5-2</button><header class="monitor-header"><div class="student-avatar large ' + escapeHtml(student.state) + '">' + escapeHtml(student.name.charAt(0)) + '</div><div><p class="classroom-kicker">STUDENT ACTIVITY</p><h1>' + escapeHtml(student.name) + ' <small>' + escapeHtml(student.alias) + '</small></h1><p>' + escapeHtml(student.work) + ' · 최근 활동 ' + escapeHtml(student.updated) + '</p></div><span class="student-state ' + escapeHtml(student.state) + '">' + escapeHtml(student.stateLabel) + '</span></header><div class="monitor-grid"><section class="monitor-evidence"><div class="section-heading"><div><span>LATEST SNAPSHOT</span><h2>최근 저장된 작업</h2></div><button type="button" data-class-action="refresh-student">↻ 새로고침</button></div><div class="monitor-code"><span>저장 시각 · ' + escapeHtml(student.updated) + '</span><code>버튼을 누르면<br>&nbsp;&nbsp;LED를 다음 신호로 바꾸기<br>&nbsp;&nbsp;0.8초 기다리기</code></div><div class="monitor-modules"><b>MODI 구성</b>' + (student.modules.length ? student.modules.map((module, index) => (index ? '<i>→</i>' : '') + '<span>' + escapeHtml(module) + '</span>').join('') : '<em>아직 연결된 모듈이 없어요.</em>') + '</div><div class="attempt-log"><b>최근 시도 기록</b><ol><li><time>10:22</time><span>LED 신호 순서 시험</span><em>통과</em></li><li><time>10:18</time><span>NETWORK 연결 확인</span><em>수정함</em></li><li><time>10:12</time><span>버튼 입력 시험</span><em>통과</em></li></ol></div></section><aside class="monitor-side"><section><span>TEACHER NOTE</span><h2>관찰 메모</h2><textarea rows="5" placeholder="수업 중 관찰한 점을 기록하세요.">' + (student.state === 'help' ? 'NETWORK 모듈 연결 방향을 함께 확인할 필요가 있음.' : '') + '</textarea><button type="button" data-class-action="save-note">메모 저장</button></section><section class="teacher-nudge"><span>SEND A NUDGE</span><h2>학생에게 도움 보내기</h2><button type="button" data-class-action="send-hint">“모듈 연결을 다시 확인해 볼까요?”</button><button type="button" data-class-action="call-student">자리에서 함께 보기</button><small>완성 코드 대신 다음 확인 지점을 전달합니다.</small></section></aside></div></div>';
  document.title = student.name + " 활동 · 별빛 메이커 5-2";
}

export function renderStudentClassroom() {
  const student = CLASSROOM_MOCK.student;
  const joinedClasses = CLASSROOM_MOCK.classes.map((classInfo, index) => ({
    ...classInfo,
    teacher: index === 0 ? student.teacher : "이메이커 선생님",
    works: student.works
  }));
  return [
    '<div class="classroom-page student-room student-class-list"><header class="classroom-hero student"><div><p class="classroom-kicker">MY CLASSROOMS</p><h1>', escapeHtml(student.nickname), '의 나의 교실</h1><p>참여 중인 반을 선택해 교실로 들어가세요.</p></div><div class="student-head-actions"><button class="join-class-button" type="button" data-student-action="join">＋ 반 참여</button>', renderRoleSwitch("student"), '</div></header>',
    '<section><div class="section-heading"><div><span>JOINED CLASSES</span><h2>참여 반 <small>', joinedClasses.length, '개</small></h2></div></div><div class="student-class-cards">',
    joinedClasses.map((classInfo, index) => '<article class="student-class-card student-class-tone-' + ((index % 3) + 1) + '"><div><span>' + escapeHtml(classInfo.grade) + '</span><b>참여 중</b></div><h2>' + escapeHtml(classInfo.name) + '</h2><p>' + escapeHtml(classInfo.teacher) + '</p><dl><div><dt>내 작품</dt><dd>' + classInfo.works.length + '개</dd></div><div><dt>다음 수업</dt><dd>' + escapeHtml(classInfo.next) + '</dd></div></dl><button type="button" data-student-class="' + escapeHtml(classInfo.id) + '">교실 들어가기 →</button></article>').join(''),
    '</div></section></div>'
  ].join('');
}

export function renderStudentClassDetail(classId) {
  const student = CLASSROOM_MOCK.student;
  const selectedIndex = Math.max(0, CLASSROOM_MOCK.classes.findIndex((item) => item.id === classId));
  const classInfo = CLASSROOM_MOCK.classes[selectedIndex];
  const teacher = selectedIndex === 0 ? student.teacher : "이메이커 선생님";
  const works = student.works;
  const submitted = localStorage.getItem(CLASSROOM_KEY + "-submission") === "submitted";
  localStorage.setItem(CLASSROOM_KEY + "-student-class", classInfo.id);
  document.title = classInfo.name + " · 나의 교실";
  main.innerHTML = [
    '<div class="classroom-page student-room"><button class="back-link" type="button" data-student-action="class-list">← 참여 반</button><header class="classroom-hero student"><div><p class="classroom-kicker">MY MAKER SPACE</p><h1>', escapeHtml(student.nickname), '의 나의 교실</h1><p>', escapeHtml(classInfo.name), ' · ', escapeHtml(teacher), '</p></div><div class="student-head-actions">', renderRoleSwitch("student"), '</div></header>',
    '<section class="joined-class"><header class="joined-class-header"><div><span>참여 반</span><h2>', escapeHtml(classInfo.name), '</h2><p>', escapeHtml(teacher), '</p></div><b>참여 중</b></header>',
    submitted ? '<section class="next-mission submitted-mission"><div><span>SUBMITTED · 선생님 확인 대기</span><h2>교통 신호등 작품을 잘 제출했어요</h2><p>피드백이 도착하면 나의 교실에서 바로 알려 줄게요. 다음에는 보물 지킴이를 만들어요.</p><div class="mission-tags"><span>코드 저장됨</span><span>모듈 3개</span><span>작동 영상 00:18</span></div></div><div class="mission-visual"><b>제출</b><span>→</span><b>교사 확인</b><span>→</span><b>피드백</b></div><button type="button" data-student-action="work" data-work-id="signal">제출 작품 보기 →</button></section>' : '<section class="next-mission"><div><span>NEXT MISSION · 8월 27일까지</span><h2>보행자 신호 회로를 완성해 볼까요?</h2><p>버튼을 눌렀을 때 LED 신호가 순서대로 바뀌는지 직접 확인해요.</p><div class="mission-tags"><span>체크리스트 4개</span><span>MODI 연결</span><span>작동 영상 제출</span></div></div><div class="mission-visual"><i></i><b>BUTTON</b><span>→</span><b>NETWORK</b><span>→</span><b>LED</b></div><button type="button" data-student-action="continue">이어서 만들기 →</button></section>',
    '<div class="student-layout"><section><div class="section-heading"><div><span>MY CREATIONS</span><h2>내 작품 갤러리 <small>완성한 작품 ' + works.length + '개</small></h2></div><button class="text-button" type="button" data-student-action="feedback">피드백 모아보기</button></div><div class="work-gallery">', works.map((work) => '<article><div class="work-art ' + work.art + '"><span>MODI</span><i></i><b>' + escapeHtml(work.badge) + '</b></div><div class="work-copy"><small>' + escapeHtml(work.lesson) + ' · ' + escapeHtml(work.status) + '</small><h3>' + escapeHtml(work.title) + '</h3><p>“' + escapeHtml(work.teacherFeedback) + '”</p><button type="button" data-student-action="work" data-work-id="' + escapeHtml(work.id) + '">작품 펼쳐보기 →</button></div></article>').join(''), '</div></section>',
    '<aside class="student-side">',
    '<section class="feedback-card"><span>NEW FEEDBACK</span><h2>새 피드백 2개</h2><div><b>김모디 선생님</b><p>오류를 찾은 뒤 조건 블록을 바꾼 과정이 아주 좋아요.</p></div><div class="ai"><b>AI 튜터 · 생각 힌트</b><p>센서 값이 경계에 있을 때 어떤 일이 생길지 시험해 볼까요?</p></div><button type="button" data-student-action="feedback">모두 보기 →</button></section>',
    '<section class="badge-card"><div class="badge-seal">★</div><div><span>NEW BADGE</span><h3>끝까지 디버거</h3><p>오류를 수정하고 작품을 작동시켰어요</p><button type="button" data-student-action="badges">배지·인증서 보기 →</button></div></section></aside></div></section></div>'
  ].join('');
}

export function openReviewPanel(index) {
  const submission = CLASSROOM_MOCK.submissions[index || 0];
  main.innerHTML = '<div class="classroom-page review-page"><button class="back-link" type="button" data-office-action="back">← 채점 대기열</button><header class="review-header"><div><p class="classroom-kicker">TEACHER REVIEW</p><h1>' + escapeHtml(submission.student) + ' · ' + escapeHtml(submission.work) + '</h1><p>코드 스냅샷, 모듈 구성, 작동 결과를 함께 보고 피드백을 확정하세요.</p></div><span class="ai-draft-label">AI 형성평가 초안</span></header><div class="review-grid"><section class="evidence-panel"><h2>제출 증거</h2><div class="code-snapshot"><div><i></i><i></i><i></i><span>CODE SNAPSHOT</span></div><code>버튼을 누르면<br>&nbsp;&nbsp;LED 색상을 다음 신호로 바꾸기<br>&nbsp;&nbsp;0.8초 기다리기</code></div><div class="module-proof"><b>모듈 구성</b><span>BUTTON</span><i>→</i><span>NETWORK</span><i>→</i><span>LED</span></div><div class="run-proof"><b>작동 결과</b><span>▶ 00:18 작동 영상</span><em>신호 3단계 작동 확인</em></div></section><section class="rubric-editor"><div class="ai-principle"><b>AI가 먼저 살펴봤어요</b><p>아래 내용은 초안입니다. 점수와 문장을 수정한 뒤 선생님이 확정해 주세요.</p></div><h2>루브릭 평가</h2>' + [
    ["과제 완성도", "요구한 신호 3단계가 모두 작동해요.", 3], ["문제해결 과정", "작동 간격 오류를 찾아 대기 시간을 수정했어요.", 3], ["코드 구조 이해", "입력과 출력 블록을 적절히 연결했어요.", 2], ["확장·창의", "보행 시간 안내음을 추가로 시도했어요.", 2]
  ].map((row, ri) => '<article class="rubric-row"><div><b>' + row[0] + '</b><span>AI 제안</span></div><div class="score-options">' + [1,2,3].map((score) => '<button type="button" class="' + (score === row[2] ? 'selected' : '') + '" data-rubric-score="' + ri + '-' + score + '">' + score + '</button>').join('') + '</div><textarea rows="2">' + row[1] + '</textarea></article>').join('') + '<label class="final-feedback"><b>학생에게 전할 종합 피드백</b><textarea rows="3">버튼 입력과 LED 출력의 관계를 정확히 이해했어요. 다음에는 신호가 바뀌는 시간을 직접 정해 더 안전한 신호등으로 확장해 보세요.</textarea></label><div class="review-actions"><button type="button" data-office-action="draft">임시 저장</button><button type="button" class="confirm" data-office-action="confirm">교사 평가로 확정 · 전달</button></div></section></div></div>';
  document.title = "평가 확정 · MODI Planet";
}

export function openSubmitPanel() {
  main.innerHTML = '<div class="classroom-page submit-page"><button class="back-link" type="button" data-student-action="back">← 나의 교실</button><header><p class="classroom-kicker">SELF CHECK & SUBMIT</p><h1>작품 제출 전, 내가 먼저 확인해요</h1><p>점수가 아니라 내 작품이 잘 만들고 작동하는지 살펴보는 시간이에요.</p></header><div class="submit-grid"><section><h2>MODI 교통 신호등</h2><div class="submission-proof"><article><span>01</span><b>코드 스냅샷</b><em>자동 저장됨</em></article><article><span>02</span><b>모듈 구성</b><em>3개 연결됨</em></article><article><span>03</span><b>작동 결과</b><em>영상 추가됨</em></article></div><div class="submission-preview"><b>제출 묶음 미리보기</b><p>코드 12블록 · BUTTON/NETWORK/LED · 작동 영상 00:18</p></div></section><section class="self-check"><h2>나의 자기점검</h2><p>내 작품에 해당하는 항목을 모두 확인해요.</p>' + ["버튼을 누르면 신호가 순서대로 바뀌어요.", "오류가 났을 때 원인을 찾아 다시 시도했어요.", "어떤 블록과 모듈을 썼는지 설명할 수 있어요.", "나만의 기능을 하나 더 시도했어요. (선택)"].map((item, i) => '<label><input type="checkbox" data-self-check="' + i + '" ' + (i < 3 ? 'checked' : '') + '><span>' + item + '</span></label>').join('') + '<label class="reflection"><b>가장 뿌듯한 점</b><textarea rows="3" placeholder="내 작품에서 가장 잘 된 점을 적어 보세요.">신호가 너무 빨리 바뀌는 문제를 직접 고친 점이 뿌듯해요.</textarea></label><p class="submit-agreement">제출하면 코드·모듈 구성·작동 결과가 선생님에게 함께 전달돼요.</p><button class="submit-work" type="button" data-student-action="confirm-submit">선생님께 작품 제출하기</button></section></div></div>';
  document.title = "작품 제출 · MODI Planet";
}

export function getStudentWork(id) {
  return CLASSROOM_MOCK.student.works.find((work) => work.id === id) || CLASSROOM_MOCK.student.works[0];
}

export function openWorkDetail(id) {
  const work = getStudentWork(id);
  main.innerHTML = [
    '<div class="classroom-page work-detail-page"><button class="back-link" type="button" data-student-action="back">← 내 작품 갤러리</button>',
    '<header class="work-detail-header"><div><p class="classroom-kicker">MY CREATION · ', escapeHtml(work.lesson), '</p><h1>', escapeHtml(work.title), '</h1><p>', escapeHtml(work.submitted), ' 제출 · ', escapeHtml(work.status), '</p></div><span class="completion-chip">✓ ', escapeHtml(work.badge), '</span></header>',
    '<div class="work-detail-grid"><section class="work-showcase"><div class="work-stage ', escapeHtml(work.art), '"><span>MY MODI PROJECT</span><div class="stage-device"><i></i><b>', escapeHtml(work.title), '</b></div><button type="button" data-student-action="play">▶ 작동 결과 재생</button></div>',
    '<div class="evidence-tabs" role="tablist"><button class="active" type="button">코드 스냅샷</button><button type="button">모듈 구성</button><button type="button">작동 기록</button></div>',
    '<div class="student-code-proof"><div><span>when</span> 버튼을 누르면</div><div class="indent"><span>set</span> LED를 다음 신호로 바꾸기</div><div class="indent"><span>wait</span> 0.8초 기다리기</div><div class="indent"><span>test</span> 신호 순서 확인하기</div></div>',
    '<div class="work-module-chain">', work.modules.map((module, index) => (index ? '<i>→</i>' : '') + '<span>' + escapeHtml(module) + '</span>').join(''), '</div>',
    '<ul class="test-evidence">', work.tests.map((test) => '<li><span>✓</span>' + escapeHtml(test) + '</li>').join(''), '</ul></section>',
    '<aside class="work-insight"><section><span>MY NOTE</span><h2>내가 남긴 기록</h2><p>“', escapeHtml(work.reflection), '”</p></section>',
    '<section><span>TEACHER FEEDBACK</span><h2>선생님 피드백</h2><p>', escapeHtml(work.teacherFeedback), '</p></section>',
    '<section class="ai"><span>AI TUTOR</span><h2>다음 생각 힌트</h2><p>', escapeHtml(work.aiFeedback), '</p><button type="button" data-student-action="ask-tutor">힌트 한 단계 더 보기</button></section>',
    '<section><span>RUBRIC</span><h2>작품에서 확인한 것</h2><div class="student-rubric">', work.rubric.map((row) => '<div><b>' + escapeHtml(row[0]) + '</b><span>' + [1,2,3].map((score) => '<i class="' + (score <= row[1] ? 'filled' : '') + '"></i>').join('') + '</span></div>').join(''), '</div><small>AI 제안을 김모디 선생님이 확인한 평가예요.</small></section></aside></div></div>'
  ].join('');
  document.title = work.title + " · 나의 교실";
}

export function openFeedbackArchive() {
  const works = CLASSROOM_MOCK.student.works;
  main.innerHTML = '<div class="classroom-page feedback-page"><button class="back-link" type="button" data-student-action="back">← 나의 교실</button><header><p class="classroom-kicker">FEEDBACK ARCHIVE</p><h1>내 작품에 도착한 피드백</h1><p>선생님이 확정한 피드백과 AI 튜터의 생각 힌트를 작품별로 모았어요.</p></header><div class="feedback-timeline">' + works.map((work) => '<article><div class="timeline-work"><span>' + escapeHtml(work.lesson) + '</span><h2>' + escapeHtml(work.title) + '</h2><button type="button" data-student-action="work" data-work-id="' + escapeHtml(work.id) + '">작품 보기</button></div><div class="timeline-notes"><section><b>김모디 선생님 · 확정 피드백</b><p>' + escapeHtml(work.teacherFeedback) + '</p></section><section class="ai"><b>AI 튜터 · 생각 힌트</b><p>' + escapeHtml(work.aiFeedback) + '</p></section></div></article>').join('') + '</div></div>';
  document.title = "받은 피드백 · 나의 교실";
}

export function openBadgeCollection() {
  const student = CLASSROOM_MOCK.student;
  main.innerHTML = '<div class="classroom-page badge-page"><button class="back-link" type="button" data-student-action="back">← 나의 교실</button><header><p class="classroom-kicker">MAKER ACHIEVEMENTS</p><h1>내가 완성해서 얻은 기록</h1><p>몇 퍼센트를 봤는지가 아니라, 직접 만들고 작동시킨 경험으로 받은 배지예요.</p></header><div class="badge-collection">' + student.badges.map((badge) => '<article><div>' + escapeHtml(badge.icon) + '</div><span>' + escapeHtml(badge.date) + '</span><h2>' + escapeHtml(badge.title) + '</h2><p>' + escapeHtml(badge.reason) + '</p></article>').join('') + '</div><section class="certificate-card"><div><span>MODI PLANET MAKER CERTIFICATE</span><h2>' + escapeHtml(student.name) + ' 학생</h2><p>Web과 MODI 모듈을 연결한 작품 3개를 완성하고, 작동 증거와 문제해결 기록을 남겼습니다.</p><small>별빛 메이커 5-2 · 김모디 선생님 확인</small></div><div class="certificate-seal">MP<br><b>3</b></div><button type="button" data-student-action="certificate">인증서 저장</button></section></div>';
  document.title = "성취 배지 · 나의 교실";
}

export function openJoinClass() {
  main.innerHTML = '<div class="classroom-page join-page"><button class="back-link" type="button" data-student-action="back">← 나의 교실</button><section class="join-card"><div class="join-mark">M</div><p class="classroom-kicker">JOIN A CLASS</p><h1>새로운 반에 참여해요</h1><p>선생님이 알려준 초대코드를 입력하세요. 계정을 만들지 않아도 별명으로 참여할 수 있어요.</p><form id="joinClassForm"><label>초대코드<input name="invite" autocomplete="off" maxlength="12" placeholder="예: MODI-52" required></label><label>교실에서 사용할 별명<input name="nickname" value="하늘이" maxlength="12" required></label><button type="submit">반 확인하기 →</button></form><div class="join-help"><b>초대 링크를 받았나요?</b><span>링크를 열면 초대코드가 자동으로 입력돼요.</span></div></section></div>';
  document.title = "반 참여 · MODI Planet";
}

export function openSubmissionComplete() {
  localStorage.setItem(CLASSROOM_KEY + "-submission", "submitted");
  main.innerHTML = '<div class="classroom-page submission-complete"><section><div class="complete-orbit"><i></i><span>✓</span></div><p class="classroom-kicker">SUBMISSION COMPLETE</p><h1>하늘이의 작품이 도착했어요!</h1><p>김모디 선생님이 코드와 작동 결과를 확인한 뒤 피드백을 보내 줄 거예요.</p><div class="submission-ticket"><span>제출 작품</span><b>MODI 교통 신호등</b><span>전달한 증거</span><b>코드 스냅샷 · 모듈 3개 · 작동 영상</b><span>현재 상태</span><b class="waiting">교사 확인 대기</b></div><div class="complete-actions"><button type="button" data-student-action="work" data-work-id="signal">제출한 작품 보기</button><button type="button" class="primary" data-student-action="back">나의 교실로</button></div></section></div>';
  document.title = "제출 완료 · 나의 교실";
}
