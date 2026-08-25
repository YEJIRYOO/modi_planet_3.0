// MODI Planet LMS 진입점. 도메인 모듈은 web/lms/js/ 아래에 있다.
//
// events.js 는 import 만으로 전역 이벤트 위임과 요소 배선을 끝낸다. 정적 import 는
// 이 파일 본문보다 먼저 평가되므로, boot() 이 첫 화면을 그릴 때 배선은 이미 서 있다.
import "./lms/js/events.js";
import { boot } from "./lms/js/routes.js";

boot();
