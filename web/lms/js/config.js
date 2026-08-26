// MODI Planet LMS — 정적 설정. 레벨/모드 메타, 교실 데모 데이터, 프리뷰 프리셋, 슬라이드 문법 데이터.

export const LEVELS = [
  { id: "elementary", difficulty: "초급", thumbnail: "beginner-thumbnail.png" },
  { id: "middle", difficulty: "중급", thumbnail: "intermediate-thumbnail.png" },
  { id: "high", difficulty: "고급", thumbnail: "advanced-thumbnail.png" }
];

export const MODES = {
  web: { label: "Web", long: "Web 만들기", range: "1~3차시" },
  hw: { label: "하드웨어", long: "H/W 만들기", range: "4~6차시" },
  webhw: { label: "Web + 하드웨어", long: "Web + H/W", range: "7~9차시" }
};

export const WORLD_PROFILES = {
  elementary: { id: "elementary", name: "MOMO PLANET", zone: "별빛 행성학교" },
  middle: { id: "middle", name: "NOVA CITY", zone: "루나 메이커 페스티벌" },
  high: { id: "high", name: "ORBIT-9", zone: "심우주 시스템 미션" }
};

export const PROGRESS_KEY = "modi-planet-curriculum-progress-v1";
export const USER_KEY = "modi-planet-lms-user-v1";
export const CLASSROOM_KEY = "modi-planet-classroom-demo-v1";

export const CLASSROOM_MOCK = {
  role: "teacher",
  classes: [
    { id: "c1", name: "별빛 메이커 5-2", grade: "초등 5학년", students: 24, active: 18, invite: "MODI-52", next: "8월 27일 · 4차시", pending: 5 },
    { id: "c2", name: "창의융합 방과후", grade: "초등 5~6학년", students: 16, active: 12, invite: "MAKE-16", next: "8월 29일 · 7차시", pending: 2 }
  ],
  lessons: [
    { no: 4, title: "보행자 신호 회로", date: "8.27 (목)", state: "다음 수업", type: "하드웨어" },
    { no: 5, title: "보물 지킴이", date: "9.03 (목)", state: "배정됨", type: "하드웨어" },
    { no: 7, title: "별빛 행성 탐사차", date: "9.10 (목)", state: "준비 중", type: "Web + H/W" }
  ],
  submissions: [
    { student: "김하늘", work: "MODI 교통 신호등", time: "오늘 10:24", status: "채점 대기", color: "coral" },
    { student: "이도윤", work: "보물 지킴이", time: "오늘 09:48", status: "교사 확인 필요", color: "violet" },
    { student: "박서아", work: "바람 3단 선풍기", time: "어제 16:12", status: "재제출", color: "blue" }
  ],
  student: {
    name: "김하늘", nickname: "하늘이", className: "별빛 메이커 5-2", teacher: "김모디 선생님", invite: "MODI-52",
    works: [
      { id: "signal", title: "MODI 교통 신호등", lesson: "4차시", submitted: "8월 25일 10:24", status: "평가 완료", art: "signal", badge: "작동했어요", teacherFeedback: "신호 순서를 차분히 검증했어요. 대기 시간을 직접 고친 과정이 특히 좋았어요.", aiFeedback: "다음에는 보행자가 건널 수 있는 시간을 소리로 알려주는 방법을 생각해 볼까요?", reflection: "신호가 너무 빨리 바뀌는 문제를 직접 고친 점이 뿌듯해요.", modules: ["BUTTON", "NETWORK", "LED"], tests: ["버튼 입력 3회", "신호 순서 통과", "0.8초 간격 확인"], rubric: [["과제 완성도",3],["문제해결 과정",3],["코드 구조 이해",2],["확장·창의",2]] },
      { id: "wheel", title: "오늘의 행운 뽑기", lesson: "3차시", submitted: "8월 18일 14:10", status: "제출 완료", art: "wheel", badge: "나만의 확장", teacherFeedback: "친구를 배려하는 문구가 돋보여요.", aiFeedback: "같은 문구가 연속으로 나오지 않게 하려면 무엇을 기억해야 할까요?", reflection: "친구들이 웃을 수 있는 문구를 직접 만든 점이 좋아요.", modules: ["WEB BUTTON", "RANDOM", "TEXT"], tests: ["응원 문구 5개", "10회 반복 시험", "유해 표현 0개"], rubric: [["과제 완성도",3],["문제해결 과정",2],["코드 구조 이해",2],["확장·창의",3]] },
      { id: "forest", title: "우리 반 이야기 숲", lesson: "2차시", submitted: "8월 11일 11:40", status: "피드백 받음", art: "forest", badge: "완성", teacherFeedback: "읽기 좋은 순서로 잘 정리했어요.", aiFeedback: "친구들이 가장 먼저 알고 싶어 할 내용은 무엇일까요?", reflection: "우리 반의 장점을 세 가지로 정리했어요.", modules: ["TITLE", "CARD", "IMAGE"], tests: ["내용 순서 확인", "모바일 미리보기", "빠진 항목 0개"], rubric: [["과제 완성도",3],["문제해결 과정",2],["코드 구조 이해",2],["확장·창의",2]] }
    ],
    badges: [
      { icon: "★", title: "끝까지 디버거", reason: "오류를 수정하고 작품을 작동시켰어요", date: "8월 25일" },
      { icon: "◆", title: "첫 작품 완성", reason: "첫 번째 작품을 끝까지 제출했어요", date: "8월 11일" },
      { icon: "✦", title: "친구 생각", reason: "다른 사람을 배려하는 기능을 만들었어요", date: "8월 18일" }
    ]
  },
  roster: [
    { id: "s1", name: "김하늘", alias: "하늘이", state: "submitted", stateLabel: "제출 완료", work: "MODI 교통 신호등", evidence: "코드 · 모듈 · 영상", updated: "방금 전", modules: ["BUTTON", "NETWORK", "LED"], attempts: 3 },
    { id: "s2", name: "이도윤", alias: "도윤", state: "building", stateLabel: "만드는 중", work: "MODI 교통 신호등", evidence: "코드 저장됨", updated: "2분 전", modules: ["BUTTON", "LED"], attempts: 2 },
    { id: "s3", name: "박서아", alias: "별콩", state: "feedback", stateLabel: "피드백 확인", work: "오늘의 행운 뽑기", evidence: "재제출 준비", updated: "8분 전", modules: ["WEB BUTTON", "TEXT"], attempts: 4 },
    { id: "s4", name: "최민준", alias: "우주", state: "help", stateLabel: "도움 필요", work: "MODI 교통 신호등", evidence: "MODI 연결 안 됨", updated: "11분 전", modules: ["BUTTON"], attempts: 5 },
    { id: "s5", name: "정유나", alias: "나무", state: "ready", stateLabel: "시작 전", work: "MODI 교통 신호등", evidence: "활동실 미입장", updated: "오늘", modules: [], attempts: 0 },
    { id: "s6", name: "강지호", alias: "코코", state: "building", stateLabel: "작동 확인 중", work: "MODI 교통 신호등", evidence: "모듈 3개 연결", updated: "1분 전", modules: ["BUTTON", "NETWORK", "LED"], attempts: 1 }
  ]
};

export const PREVIEW_PRESETS = {
  "elementary-01": { product: "햇살의 작은 우주", eyebrow: "나의 소개 카드", primaryLabel: "반가워! 내 별명은", primaryValue: "햇살", status: "개인정보 0개", message: "그림 그리기 · 우주 관찰 · 고양이 돌보기", metrics: [["취미", "3가지"], ["안전 점검", "완료"], ["수정", "1회"]], meter: 100, action: "카드 인사 보기", activeStatus: "친구 공개 준비 완료", activePrimary: "안녕!" },
  "elementary-02": { product: "우리 반, 같이 자라는 숲", eyebrow: "우리 반 소개 페이지", primaryLabel: "계획한 순서", primaryValue: "3단계", status: "내용 확인 완료", message: "반 이름 → 급훈 → 우리 반 자랑 3가지", metrics: [["소개 항목", "5개"], ["빠진 내용", "0개"], ["요청 기록", "3개"]], meter: 92, action: "페이지 흐름 보기", activeStatus: "발표 화면 준비 완료", activePrimary: "우리 반 최고!" },
  "elementary-03": { product: "오늘의 행운 뽑기", eyebrow: "긍정 운세 머신", primaryLabel: "오늘의 한마디", primaryValue: "좋은 일이 가까워요", status: "배려 문구만 사용", message: "버튼을 누를 때마다 다섯 가지 응원 중 하나가 나타나요.", metrics: [["응원 문구", "5개"], ["시험", "10회"], ["유해 표현", "0개"]], meter: 88, action: "운세 다시 뽑기", activeStatus: "새 운세를 뽑았어요", activePrimary: "용기 100점!" },
  "elementary-04": { product: "MODI 교통 신호등", eyebrow: "입력 → 프로그램 → 출력", primaryLabel: "현재 신호", primaryValue: "초록", status: "샘플 시뮬레이션", message: "보행자 버튼을 누르면 빨강·노랑·초록 순서로 LED가 바뀝니다.", metrics: [["입력", "버튼"], ["처리", "순서"], ["출력", "LED"]], meter: 74, action: "신호 바꾸기", activeStatus: "버튼 입력 감지", activePrimary: "노랑", input: "버튼 ON", logic: "색상 +1", output: "LED 초록" },
  "elementary-05": { product: "보물 지킴이", eyebrow: "거리 센서 경보기", primaryLabel: "안전 기준", primaryValue: "20 cm", status: "SAFE · 샘플", message: "손이 기준보다 가까워지면 빨간 LED와 경보음이 함께 켜집니다.", metrics: [["현재 거리", "42 cm"], ["조건", "20 cm 미만"], ["경보", "대기"]], meter: 68, action: "가까이 다가가기", activeStatus: "ALERT · 경보 작동", activePrimary: "14 cm", input: "거리 42cm", logic: "20cm 비교", output: "초록 LED" },
  "elementary-06": { product: "바람 3단 선풍기", eyebrow: "다이얼 속도 제어", primaryLabel: "다이얼 위치", primaryValue: "62%", status: "중풍 · 샘플", message: "다이얼을 오른쪽으로 돌릴수록 종이 날개가 더 빠르게 회전합니다.", metrics: [["바람", "중풍"], ["모터", "128 rpm"], ["안전", "확인"]], meter: 62, action: "강풍으로 돌리기", activeStatus: "강풍 · 출력 변경", activePrimary: "92%", input: "다이얼 62%", logic: "3단계 매핑", output: "모터 128rpm" },
  "elementary-07": { product: "STAR SCOUT 01", eyebrow: "별빛 행성 탐사차", primaryLabel: "크레이터 거리", primaryValue: "18 cm", status: "AUTO SAFE · 샘플", message: "탐사차가 빛나는 정원 길을 달리다가 크레이터 앞에서 스스로 멈춥니다.", metrics: [["탐사 상태", "안전 정지"], ["추진력", "0%"], ["임무 시험", "3/3"]], meter: 46, action: "탐사 장면 재생", activeStatus: "탐사 → 자동 정지", activePrimary: "SAFE", input: "거리 센서", logic: "18cm 안전 정지", output: "모터 OFF" },
  "elementary-08": { product: "MOMO BASE CONTROL", eyebrow: "기지 ↔ 탐사차", primaryLabel: "탐사차 연결", primaryValue: "연결됨", status: "양방향 샘플", message: "기지의 명령은 탐사차로, 센서의 거리 값은 기지 계기판으로 이동합니다.", metrics: [["거리", "64 cm"], ["추진력", "42%"], ["명령", "탐사 시작"]], meter: 72, action: "귀환 명령 보내기", activeStatus: "귀환 명령 전달 완료", activePrimary: "RETURN", input: "기지 버튼", logic: "명령 전송", output: "탐사차 제어" },
  "elementary-09": { product: "별빛 탐험 쇼케이스", eyebrow: "최종 탐사 브리핑", primaryLabel: "안전 미션 기록", primaryValue: "3/3", status: "발표 준비 완료", message: "2분 브리핑과 1분 탐사 시연으로 기능·구조·수정 과정을 보여 줍니다.", metrics: [["안전 점검", "100%"], ["브리핑", "2분"], ["탐사 시연", "1분"]], meter: 96, action: "미션 데모 시작", activeStatus: "LIVE MISSION · 샘플", activePrimary: "SUCCESS", input: "기지 리모컨", logic: "안전 조건", output: "탐사 시연" },
  "middle-01": { product: "우리 반 D-day", eyebrow: "요구사항 기반 알림 앱", primaryLabel: "과학 수행평가", primaryValue: "D-5", status: "수용 기준 통과", message: "마감일과 오늘 날짜를 계산해 남은 날짜를 카드로 표시합니다.", metrics: [["등록 일정", "4개"], ["임박 일정", "1개"], ["검증", "5/5"]], meter: 66, action: "임박 일정 확인", activeStatus: "D-3 강조 규칙 확인", activePrimary: "D-3" },
  "middle-02": { product: "Sprint 기록판", eyebrow: "변수와 상태", primaryLabel: "최고 기록", primaryValue: "5.00초", status: "기록 저장 완료", message: "5.20 · 5.00 · 5.40초를 저장하고 가장 짧은 기록을 비교합니다.", metrics: [["현재 기록", "3개"], ["평균", "5.20초"], ["상태", "STOP"]], meter: 84, action: "새 기록 측정", activeStatus: "RUNNING · 상태 변경", activePrimary: "00:03.24" },
  "middle-03": { product: "밸런스 투표 LAB", eyebrow: "디버깅 전후 비교", primaryLabel: "빠른 두 번 클릭", primaryValue: "1표", status: "버그 수정 완료", message: "첫 클릭 뒤 버튼을 잠가 중복 투표가 집계되지 않게 고쳤습니다.", metrics: [["수정 전", "2표"], ["수정 후", "1표"], ["회귀 시험", "통과"]], meter: 100, action: "중복 클릭 시험", activeStatus: "두 번째 클릭 차단", activePrimary: "PASS" },
  "middle-04": { product: "MOOD LIGHT", eyebrow: "밝기 기반 자동 조명", primaryLabel: "현재 밝기", primaryValue: "20 lx", status: "LED ON · 샘플", message: "세 장소의 측정값으로 임계값을 정해 어두운 곳에서만 켜집니다.", metrics: [["임계값", "35 lx"], ["LED", "파란색"], ["표본", "9개"]], meter: 35, action: "밝은 곳으로 이동", activeStatus: "LED OFF · 조건 변경", activePrimary: "48 lx", input: "밝기 20lx", logic: "35lx 비교", output: "LED ON" },
  "middle-05": { product: "SAFE DOOR", eyebrow: "거리·시간 제어", primaryLabel: "문 상태", primaryValue: "OPEN", status: "샘플 시뮬레이션", message: "22cm 이상이 3초 동안 유지된 뒤에만 문을 닫습니다.", metrics: [["현재 거리", "14 cm"], ["대기 시간", "3.0초"], ["모터", "열림"]], meter: 58, action: "통과 장면 재생", activeStatus: "3초 확인 후 닫힘", activePrimary: "CLOSED", input: "거리 14cm", logic: "거리+시간", output: "모터 OPEN" },
  "middle-06": { product: "MODI BEAT", eyebrow: "전자 드럼 키트", primaryLabel: "볼륨 다이얼", primaryValue: "25%", status: "4패드 준비", message: "버튼마다 다른 소리와 LED 색을 연결해 연속 입력까지 시험합니다.", metrics: [["Button 1", "북 · 파랑"], ["Button 2", "심벌 · 노랑"], ["BPM", "112"]], meter: 52, action: "샘플 비트 연주", activeStatus: "입력 2개 정상 처리", activePrimary: "BEAT!", input: "버튼 1·2", logic: "소리 매핑", output: "스피커+LED" },
  "middle-07": { product: "NOVA SENSOR STAGE", eyebrow: "관객 반응형 무대", primaryLabel: "공연 상태", primaryValue: "READY", status: "센서 리허설 · 샘플", message: "관객 거리에 따라 조명과 비트가 바뀌고 공연 상태 데이터가 생성됩니다.", metrics: [["audienceCm", "18"], ["lightLevel", "72"], ["sceneCount", "3"]], meter: 68, action: "리허설 장면 재생", activeStatus: "LIVE 장면 전환 완료", activePrimary: "LIVE", input: "거리·밝기 센서", logic: "상태 전이", output: "조명+비트" },
  "middle-08": { product: "NOVA LIVE CONSOLE", eyebrow: "실시간 공연 콘솔", primaryLabel: "관객 거리", primaryValue: "42 cm", status: "LIVE SYNC · 샘플", message: "무대 센서 데이터와 콘솔의 안전 정지 명령이 양방향으로 흐릅니다.", metrics: [["조명", "78%"], ["BPM", "112"], ["갱신", "0.2초 전"]], meter: 78, action: "장면 전환 시험", activeStatus: "FINALE 명령 확인", activePrimary: "FINALE", input: "무대 텔레메트리", logic: "라이브 콘솔", output: "장면 제어" },
  "middle-09": { product: "NOVA FESTIVAL SHOW", eyebrow: "인터랙티브 쇼케이스", primaryLabel: "검증 시나리오", primaryValue: "12/12", status: "공연 준비 완료", message: "센서 반응·LIVE 콘솔·테스트 기록이 하나의 기술 공연을 뒷받침합니다.", metrics: [["무대 구조", "완료"], ["라이브 공연", "준비"], ["질의응답", "1분"]], meter: 94, action: "쇼케이스 시작", activeStatus: "LIVE SHOW · 샘플", activePrimary: "ON AIR", input: "공연 큐", logic: "근거 연결", output: "라이브 무대" },
  "high-01": { product: "SPACE BOOKING", eyebrow: "예약 충돌 정책", primaryLabel: "16:30 요청 결과", primaryValue: "예약 거부", status: "정책 검증 완료", message: "기존 16:00~17:00 예약과 겹쳐 목록은 바꾸지 않고 수정 안내를 표시합니다.", metrics: [["기존 예약", "4개"], ["충돌", "1건"], ["데이터 변경", "0건"]], meter: 100, action: "경계 예약 시험", activeStatus: "17:00 시작은 예약 가능", activePrimary: "예약 승인" },
  "high-02": { product: "MEAL SIGNAL", eyebrow: "급식 리뷰 데이터", primaryLabel: "카레라이스 평균", primaryValue: "4.0", status: "모델 일치", message: "리뷰 2개를 평균 내고 별점순 화면과 원본 저장 순서를 분리합니다.", metrics: [["리뷰", "2개"], ["최고 별점", "5.0"], ["유효성", "통과"]], meter: 80, action: "정렬 방식 바꾸기", activeStatus: "별점순 보기", activePrimary: "5점 먼저" },
  "high-03": { product: "FOCUS 25", eyebrow: "사용성 개선 리포트", primaryLabel: "시작 버튼 탐색", primaryValue: "5초", status: "개선안 검증", message: "작은 아이콘을 큰 ‘집중 시작’ 버튼으로 바꾸고 같은 과제로 다시 측정했습니다.", metrics: [["수정 전", "12초"], ["수정 후", "5초"], ["오조작", "0회"]], meter: 72, action: "수정 전후 비교", activeStatus: "완료 시간 58% 단축", activePrimary: "-7초" },
  "high-04": { product: "ENTRY COUNTER", eyebrow: "센서 데이터 전처리", primaryLabel: "정제된 통과", primaryValue: "1명", status: "샘플 시뮬레이션", message: "110→18→17→20→112cm 연속 값은 한 번의 통과로만 집계됩니다.", metrics: [["정확도", "98.6%"], ["중복 제거", "3건"], ["누적", "184명"]], meter: 86, action: "통과 데이터 재생", activeStatus: "쿨다운 적용 완료", activePrimary: "+1", input: "거리 시계열", logic: "진입·이탈", output: "카운트 +1" },
  "high-05": { product: "THERMO CONTROL", eyebrow: "히스테리시스 제어", primaryLabel: "현재 온도", primaryValue: "29.1°C", status: "FAN ON · 샘플", message: "켜짐·꺼짐 경계를 나눠 임계값 주변에서 팬이 떨리는 현상을 줄입니다.", metrics: [["ON 경계", "29.0°C"], ["OFF 경계", "27.0°C"], ["전환", "2회"]], meter: 71, action: "온도 흐름 재생", activeStatus: "27.0°C에서 FAN OFF", activePrimary: "OFF", input: "온도 29.1°C", logic: "이전 상태 유지", output: "팬 ON" },
  "high-06": { product: "REFLEX TEST", eyebrow: "경계·예외 테스트", primaryLabel: "최고 반응속도", primaryValue: "0.211초", status: "8/8 TEST PASS", message: "신호 전에 누르면 반칙 안내를 띄우고 기존 기록은 바꾸지 않습니다.", metrics: [["이번 기록", "0.238초"], ["조기 입력", "차단"], ["회귀", "통과"]], meter: 93, action: "조기 입력 시험", activeStatus: "반칙 감지 · 기록 유지", activePrimary: "INVALID", input: "버튼 입력", logic: "상태 검증", output: "기록 보존" },
  "high-07": { product: "ORBIT-9 DOCKING ARCH", eyebrow: "3계층 도킹 아키텍처", primaryLabel: "도킹 상태", primaryValue: "APPROACH", status: "궤도 텔레메트리 · 샘플", message: "우주선→네트워크→관제실로 데이터가 흐르고 명령은 반대 방향으로 돌아옵니다.", metrics: [["도킹 거리", "28 cm"], ["계층", "3/3"], ["중단 횟수", "1회"]], meter: 52, action: "도킹 상태 전이 재생", activeStatus: "CRUISE→APPROACH→HOLD", activePrimary: "HOLD", input: "distanceCm", logic: "도킹 상태 머신", output: "추력 제어" },
  "high-08": { product: "ORBIT-9 MISSION OPS", eyebrow: "심우주 텔레메트리 관제", primaryLabel: "왕복 반응 시간", primaryValue: "74 ms", status: "LIVE · E2E 샘플", message: "우주선 상태·이벤트 로그·E-Stop 명령을 한 화면에서 종단 간 검증합니다.", metrics: [["패킷", "1,284"], ["누락", "0"], ["계층 진단", "정상"]], meter: 78, action: "E-Stop 왕복 시험", activeStatus: "명령 확인 · 도킹 중단", activePrimary: "E-STOP ACTIVE", input: "텔레메트리", logic: "E2E 검증", output: "E-STOP" },
  "high-09": { product: "ORBIT-9 INCIDENT LAB", eyebrow: "장애 대응 데모데이", primaryLabel: "요구사항 추적", primaryValue: "12/12", status: "MISSION READY", message: "실패 화면·수신 로그·원인 가설·복구 검증을 하나의 미션 사례로 연결합니다.", metrics: [["테스트 커버리지", "94%"], ["증거", "18개"], ["브리핑", "5분"]], meter: 94, action: "비상 대응 사례 보기", activeStatus: "원인 계층 식별 완료", activePrimary: "RECOVERED", input: "장애 증거", logic: "계층 진단", output: "복구 결과" }
};

export const LESSON_SCENE_PROFILES = {
  "elementary-01": { kind: "profile", code: "SAFE-ID 01", title: "개인정보 방패", subtitle: "별명과 취미만 안전하게 공개", tokens: ["별명 햇살", "취미 3", "개인정보 0"], route: 0 },
  "elementary-02": { kind: "ordered-page", code: "CLASS PAGE 02", title: "우리 반 이야기 숲", subtitle: "내용을 읽기 좋은 순서로 배치", tokens: ["반 이름", "급훈", "자랑 3"], route: 1 },
  "elementary-03": { kind: "random-wheel", code: "LUCK LAB 03", title: "응원 캡슐 머신", subtitle: "무작위 결과를 여러 번 관찰", tokens: ["문구 5", "실험 10", "유해 0"], route: 2 },
  "elementary-04": { kind: "signal-chain", code: "SIGNAL 04", title: "보행자 신호 회로", subtitle: "입력에서 출력까지 신호 여행", tokens: ["BUTTON", "NETWORK", "LED"], route: 3 },
  "elementary-05": { kind: "distance-alarm", code: "VAULT 05", title: "보물 경계 구역", subtitle: "거리 기준으로 경보를 판단", tokens: ["42 cm", "20 cm", "ALERT"], route: 4 },
  "elementary-06": { kind: "dial-fan", code: "WIND 06", title: "바람 조절 링", subtitle: "다이얼 값을 세 단계 바람으로 변환", tokens: ["62%", "중풍", "128 rpm"], route: 5 },
  "elementary-07": { kind: "rover-zone", code: "SCOUT 07", title: "크레이터 탐사차", subtitle: "센서가 보는 안전 정지 구역", tokens: ["SENSE", "STOP", "SAFE"], route: 0 },
  "elementary-08": { kind: "remote-link", code: "BASE 08", title: "기지 원격 관제", subtitle: "명령과 거리 값이 양방향 이동", tokens: ["COMMAND", "64 cm", "RETURN"], route: 1 },
  "elementary-09": { kind: "showcase", code: "LIVE 09", title: "별빛 탐험 브리핑", subtitle: "기능·구조·수정을 무대에서 설명", tokens: ["2분", "1분", "3/3"], route: 2 },
  "middle-01": { kind: "requirements-trace", code: "REQ 01", title: "D-day 요구사항 추적", subtitle: "사용자 문제부터 수용 기준까지", tokens: ["사용자", "요구사항", "D-5"], route: 3 },
  "middle-02": { kind: "stopwatch-state", code: "SPRINT 02", title: "스톱워치 상태 머신", subtitle: "이벤트에 따라 RUN·STOP 전환", tokens: ["READY", "RUN", "LAP"], route: 4 },
  "middle-03": { kind: "debug-trace", code: "DEBUG 03", title: "중복 투표 추적기", subtitle: "재현·수정·회귀 시험을 한 흐름으로", tokens: ["2표", "FIX", "PASS"], route: 5 },
  "middle-04": { kind: "lux-threshold", code: "MOOD 04", title: "빛 임계값 지도", subtitle: "측정값과 LED 조건을 비교", tokens: ["20 lx", "35 lx", "LED ON"], route: 0 },
  "middle-05": { kind: "auto-door", code: "DOOR 05", title: "안전 자동문 상태", subtitle: "거리와 시간으로 OPEN·WAIT·CLOSE", tokens: ["OPEN", "3 sec", "CLOSED"], route: 1 },
  "middle-06": { kind: "rhythm-wave", code: "BEAT 06", title: "전자 드럼 시퀀서", subtitle: "버튼·소리·빛을 박자에 맞춰 연결", tokens: ["PAD", "BEAT", "LIGHT"], route: 2 },
  "middle-07": { kind: "sensor-stage", code: "NOVA 07", title: "NOVA 센서 무대", subtitle: "관객 움직임으로 장면을 전환", tokens: ["SENSOR", "SCENE", "LIVE"], route: 3 },
  "middle-08": { kind: "telemetry-console", code: "NOVA OPS 08", title: "무대 관제 콘솔", subtitle: "텔레메트리와 E-Stop을 양방향 검증", tokens: ["DATA", "STALE", "E-STOP"], route: 4 },
  "middle-09": { kind: "festival", code: "NOVA LIVE 09", title: "NOVA 메이커 페스티벌", subtitle: "근거가 보이는 팀별 라이브 쇼", tokens: ["BOOTH", "DEMO", "FEEDBACK"], route: 5 },
  "high-01": { kind: "interval-collision", code: "BOOKING 01", title: "예약 충돌 관제", subtitle: "시간 구간 겹침과 정책을 판정", tokens: ["09:00", "OVERLAP", "REJECT"], route: 0 },
  "high-02": { kind: "er-aggregate", code: "MEAL 02", title: "리뷰 데이터 파이프라인", subtitle: "메뉴·리뷰 관계와 평균 집계", tokens: ["MENU", "1:N", "AVG 4.0"], route: 1 },
  "high-03": { kind: "journey-priority", code: "FOCUS 03", title: "사용자 여정 레이더", subtitle: "관찰한 불편을 개선 우선순위로", tokens: ["12초", "PAIN", "5초"], route: 2 },
  "high-04": { kind: "timeseries-entry", code: "ENTRY 04", title: "통과 이벤트 추출", subtitle: "거리 시계열에서 한 번의 통과만 집계", tokens: ["110", "18·17·20", "+1"], route: 3 },
  "high-05": { kind: "hysteresis-band", code: "THERMO 05", title: "히스테리시스 제어 밴드", subtitle: "켜짐·꺼짐 경계를 나눠 상태 안정화", tokens: ["29°C ON", "HOLD", "27°C OFF"], route: 4 },
  "high-06": { kind: "reaction-state", code: "REFLEX 06", title: "반응속도 상태·파형", subtitle: "조기 입력과 정상 입력을 분리 검증", tokens: ["WAIT", "READY", "0.211s"], route: 5 },
  "high-07": { kind: "orbit-architecture", code: "ORBIT-9 07", title: "3계층 도킹 아키텍처", subtitle: "우주선·통신·관제 계층을 분리", tokens: ["SHIP", "NETWORK", "OPS"], route: 0 },
  "high-08": { kind: "mission-ops", code: "ORBIT-9 08", title: "심우주 미션 관제", subtitle: "명령·텔레메트리·로그를 종단 간 추적", tokens: ["74 ms", "1,284 pkt", "E-STOP"], route: 1 },
  "high-09": { kind: "traceability-incident", code: "ORBIT-9 09", title: "장애 대응 증거망", subtitle: "요구사항부터 복구 증거까지 연결", tokens: ["REQ", "INCIDENT", "RECOVERED"], route: 2 }
};

export const SLIDE_VISUAL_META = {
  title: { label: "MISSION BRIEF", layout: "cinema" },
  goals: { label: "GOAL MAP", layout: "mission-map" },
  hook: { label: "WHY SCENE", layout: "contrast-stage" },
  vocabulary: { label: "CONCEPT ATLAS", layout: "concept-atlas" },
  concept: { label: "HOW IT WORKS", layout: "mechanism-board" },
  example: { label: "WORKED EXAMPLE", layout: "story-filmstrip" },
  check: { label: "CONCEPT CHECK", layout: "quiz-orbit" },
  setup: { label: "BUILD BENCH", layout: "topdown-bench" },
  plan: { label: "PROJECT ROUTE", layout: "route-map" },
  build: { label: "MAKER STEP", layout: "maker-blueprint" },
  checkpoint: { label: "EVIDENCE CHECK", layout: "evidence-pinboard" },
  troubleshoot: { label: "DIAGNOSTIC TREE", layout: "diagnostic-tree" },
  differentiate: { label: "LEVEL ROUTES", layout: "branch-lanes" },
  rubric: { label: "EVIDENCE MATRIX", layout: "rubric-heatmap" },
  exit: { label: "MISSION COMPLETE", layout: "completion-orbit" }
};

export const MODULE_VISUAL_MATCHES = [
  { words: ["다이얼"], file: "modi-dial.png", label: "Dial" },
  { words: ["스피커", "소리", "경보음"], file: "modi-speaker.png", label: "Speaker" },
  { words: ["LED", "조명", "신호등", "빛"], file: "modi-led.png", label: "LED" },
  { words: ["Display", "디스플레이", "화면"], file: "modi-display.png", label: "Display" },
  { words: ["Network", "네트워크", "통신", "전송"], file: "modi-network.png", label: "Network" },
  { words: ["배터리", "전원"], file: "modi-battery.png", label: "Battery" }
];
