// MODI Planet LMS — AI 튜터 대화와 스트리밍 이벤트 처리.

import { asList, showToast } from "./dom.js";
import { getActiveCatalog, state } from "./state.js";
import { renderStudio, syncTutorComposerState } from "./studio.js";

export function usePrompt(prompt) {
  const input = document.getElementById("tutorInput");
  if (state.streaming || input.disabled) {
    showToast("AI 응답이 끝난 뒤 다음 요청을 입력해 주세요.");
    return;
  }
  input.value = prompt;
  input.focus();
  input.setSelectionRange(prompt.length, prompt.length);
  showToast("예시 문장을 입력했어요. 보내기 전에 원하는 내용을 더 붙여도 됩니다.");
}

export function updateChatMessage(type, text, append) {
  if (append && state.chatMessages.length && state.chatMessages[state.chatMessages.length - 1].type === type) {
    state.chatMessages[state.chatMessages.length - 1].text += text;
  } else {
    state.chatMessages.push({ type, text });
  }
  if (state.studioTab === "activity") {
    renderStudio();
    const thread = document.getElementById("chatThread");
    if (thread) {
      thread.scrollIntoView({ block: "end" });
    }
  }
}

export async function sendTutorMessage(message) {
  if (!message || state.streaming || !state.activeLesson) {
    return;
  }
  const catalog = getActiveCatalog();
  const slide = state.activeLesson.slides[state.slideIndex];
  const codingType = slide.codingType || (state.activeLesson.projectType === "hw" ? "blockly" : state.activeLesson.projectType === "webhw" ? "hybrid" : "react");
  state.studioTab = "activity";
  state.streaming = true;
  updateChatMessage("user", message, false);
  updateChatMessage("status", "AI가 수업 활동을 확인하고 있어요…", false);
  state.abortController = new AbortController();
  syncTutorComposerState();

  try {
    const response = await fetch("/chat?user_id=" + encodeURIComponent(state.userId), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: state.abortController.signal,
      body: JSON.stringify({
        session_id: "lms-" + catalog.level + "-" + state.activeLesson.no + "-" + state.userId.slice(2, 8),
        message,
        mode: "design",
        coding_type: codingType
      })
    });
    if (!response.ok || !response.body) {
      throw new Error("AI 서버 응답 오류 (" + response.status + ")");
    }
    state.chatMessages = state.chatMessages.filter((item) => item.type !== "status");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const result = await reader.read();
      if (result.done) {
        break;
      }
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          return;
        }
        try {
          handleTutorEvent(JSON.parse(trimmed.slice(5)));
        } catch (_error) {
          // Ignore malformed stream fragments and keep reading.
        }
      });
    }
  } catch (error) {
    state.chatMessages = state.chatMessages.filter((item) => item.type !== "status");
    if (error.name !== "AbortError") {
      updateChatMessage("assistant", "AI 제작 연결을 확인해 주세요. 교안과 수업 진행 기능은 그대로 사용할 수 있습니다.\n" + error.message, false);
    }
  } finally {
    state.streaming = false;
    state.abortController = null;
    syncTutorComposerState();
  }
}

export function handleTutorEvent(event) {
  if (!event || typeof event !== "object") {
    return;
  }
  if (event.type === "token") {
    updateChatMessage("assistant", String(event.text || ""), true);
  } else if (event.type === "status") {
    state.chatMessages = state.chatMessages.filter((item) => item.type !== "status");
    updateChatMessage("status", String(event.message || "작업 중…"), false);
  } else if (event.type === "code_validated" && event.generated_code) {
    state.files = event.generated_code;
    state.previewSource = "mine";
  } else if (event.type === "blockly_ready") {
    state.blocklyXml = String(event.blockly_xml || "");
    state.modiModules = asList(event.modi_modules);
  } else if (event.type === "done") {
    state.chatMessages = state.chatMessages.filter((item) => item.type !== "status");
    if (event.generated_code) {
      state.files = event.generated_code;
      state.previewSource = "mine";
    }
    if (event.blockly_xml) {
      state.blocklyXml = String(event.blockly_xml);
    }
    if (event.modi_modules) {
      state.modiModules = asList(event.modi_modules);
    }
    if (!state.chatMessages.some((item) => item.type === "assistant")) {
      updateChatMessage("assistant", String(event.message || "작품을 만들었어요. 미리보기와 MODI 탭에서 확인하세요."), false);
    }
    renderStudio();
  } else if (event.type === "error") {
    state.chatMessages = state.chatMessages.filter((item) => item.type !== "status");
    updateChatMessage("assistant", String(event.user_message || event.message || "AI 제작 중 오류가 발생했습니다."), false);
  }
}
