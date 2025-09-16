"use client"
import { state } from "../state";
import { handleTextDblClick } from "../tools/textTool";
import { pushState } from "../history";
import { saveGuest } from "../storage";

export function onDblClick(e: MouseEvent) {
  if (!state.canvas || !state.ctx) return;

  handleTextDblClick(
    e,
    state.canvas,
    state.ctx,
    state.isServerMode ? state.roomId! : null,
    state.isServerMode ? state.socket! : null,
    state.shapes,
    state.getTool!
  );

  pushState();
  if (!state.isServerMode) saveGuest(state.shapes);
}
