type AnnotationChromeOptions = {
  clearButtonTitle: string;
  editorPlaceholder?: string;
  primaryActionLabel: string;
  promptSubtitle: string;
  promptTitle?: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderSlideReviewAnnotationStyles(): string {
  return `
      .marker-layer { position: absolute; inset: 0; pointer-events: none; }
      .comment-marker { position: absolute; transform: translate(-50%, -50%); pointer-events: auto; width: 28px; height: 28px; border: none; border-radius: 999px; background: #2563eb; color: #fff; cursor: pointer; font-size: 0.8rem; font-weight: 700; box-shadow: 0 6px 16px rgba(37,99,235,0.28); z-index: 5; }
      .comment-marker:hover { background: #1d4ed8; }
      .annotation-editor { position: absolute; z-index: 20; width: min(340px, calc(100vw - 48px)); padding: 14px; border: 1px solid #ddd; border-radius: 12px; background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,0.18); display: grid; gap: 10px; line-height: 1.4; }
      .annotation-editor[hidden] { display: none; }
      .annotation-editor-header { display: flex; justify-content: space-between; gap: 12px; align-items: flex-start; }
      .annotation-editor-title { margin: 0; font-size: 0.95rem; font-weight: 600; }
      .annotation-editor-meta { margin: 4px 0 0; color: #666; font-size: 0.82rem; }
      .annotation-editor-close { border: none; background: transparent; color: #666; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0; }
      .annotation-editor-close:hover { color: #111; }
      .annotation-editor textarea { width: 100%; min-height: 100px; padding: 10px 12px; border: 1px solid #d4d4d4; border-radius: 10px; resize: vertical; font: inherit; line-height: 1.4; }
      .annotation-editor textarea:focus, .prompt-textarea:focus { outline: 2px solid rgba(37,99,235,0.35); outline-offset: 0; border-color: #2563eb; }
      .annotation-editor-actions { display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap; }
      .btn-secondary, .btn-primary, .page-primary, .copy-button { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; font: inherit; }
      .btn-secondary { background: #eee; color: #333; }
      .btn-secondary:hover { background: #e0e0e0; }
      .btn-primary, .page-primary, .copy-button { background: #2563eb; color: #fff; }
      .btn-primary:hover, .page-primary:hover, .copy-button:hover { background: #1d4ed8; }
      .btn-destructive { margin-right: auto; background: #fee2e2; color: #b91c1c; }
      .btn-destructive:hover { background: #fecaca; }
      .page-fab-row { position: fixed; right: 24px; bottom: 24px; z-index: 40; display: flex; align-items: center; gap: 10px; }
      .page-clear { border: none; border-radius: 10px; cursor: pointer; padding: 10px 14px; background: #fee2e2; color: #b91c1c; font: inherit; }
      .page-clear:hover { background: #fecaca; }
      .page-primary { box-shadow: 0 20px 30px rgba(37,99,235,0.25); }
      .page-primary[hidden], .page-clear[hidden] { display: none; }
      .prompt-modal { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.65); display: none; align-items: center; justify-content: center; padding: 24px; }
      .prompt-modal.open { display: flex; }
      .prompt-card { width: min(960px, 100%); max-height: calc(100vh - 48px); overflow: auto; border-radius: 16px; background: #fff; box-shadow: 0 24px 48px rgba(0,0,0,0.25); padding: 20px; display: grid; gap: 14px; }
      .prompt-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
      .prompt-title { margin: 0; font-size: 1.1rem; font-weight: 700; }
      .prompt-subtitle { margin: 6px 0 0; color: #666; }
      .prompt-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .prompt-clear-btn { margin-right: auto; }
      .prompt-close { border: none; background: transparent; color: #666; cursor: pointer; font-size: 1.3rem; line-height: 1; padding: 0; }
      .prompt-close:hover { color: #111; }
      .copy-button { display: inline-flex; gap: 8px; align-items: center; }
      .copy-button svg { width: 1rem; height: 1rem; }
      .prompt-textarea { width: 100%; min-height: 420px; padding: 14px 16px; border-radius: 12px; border: 1px solid #d4d4d4; resize: vertical; background: #fff; color: #111; font: inherit; }
      .prompt-copy-status { margin: 0; min-height: 1.2em; color: #2563eb; font-size: 0.9rem; }
      body.dark .annotation-editor, body.dark .prompt-card { background: #262626; border-color: #404040; color: #e5e5e5; }
      body.dark .annotation-editor-close, body.dark .prompt-close { color: #a3a3a3; }
      body.dark .annotation-editor-close:hover, body.dark .prompt-close:hover { color: #fff; }
      body.dark .annotation-editor textarea, body.dark .prompt-textarea { background: #171717; color: #f5f5f5; border-color: #404040; }
      body.dark .annotation-editor-meta, body.dark .prompt-subtitle { color: #a3a3a3; }
      body.dark .btn-secondary { background: #404040; color: #e5e5e5; }
      body.dark .btn-secondary:hover { background: #525252; }
      body.dark .btn-destructive { background: #7f1d1d; color: #fee2e2; }
      body.dark .btn-destructive:hover { background: #991b1b; }
      body.dark .page-clear { background: #7f1d1d; color: #fee2e2; }
      body.dark .page-clear:hover { background: #991b1b; }
      body.dark .page-primary, body.dark .btn-primary, body.dark .copy-button { background: #3b82f6; }
      body.dark .page-primary:hover, body.dark .btn-primary:hover, body.dark .copy-button:hover { background: #2563eb; }
      body.dark .prompt-copy-status { color: #93c5fd; }
`;
}

export function renderSlideReviewAnnotationChrome(
  options: AnnotationChromeOptions
): string {
  const promptTitle = options.promptTitle ?? "Agent Prompt";
  const editorPlaceholder =
    options.editorPlaceholder ?? "Describe what needs to change.";

  return `
    <div class="page-fab-row">
      <button type="button" id="page-clear" class="page-clear" hidden title="${escapeHtml(options.clearButtonTitle)}">Clear</button>
      <button type="button" id="page-primary" class="page-primary" hidden>${escapeHtml(options.primaryActionLabel)}</button>
    </div>

    <div id="annotation-editor" class="annotation-editor" hidden>
      <div class="annotation-editor-header">
        <div>
          <p id="annotation-editor-title" class="annotation-editor-title">Slide comment</p>
          <p id="annotation-editor-meta" class="annotation-editor-meta"></p>
        </div>
        <button type="button" id="annotation-close" class="annotation-editor-close" aria-label="Cancel comment" title="Cancel comment">&#215;</button>
      </div>
      <textarea id="annotation-text" placeholder="${escapeHtml(editorPlaceholder)}"></textarea>
      <div class="annotation-editor-actions">
        <button type="button" id="annotation-delete" class="btn-secondary btn-destructive" hidden>Delete</button>
        <button type="button" id="annotation-cancel" class="btn-secondary">Cancel</button>
        <button type="button" id="annotation-save" class="btn-primary">Done</button>
      </div>
    </div>

    <div id="prompt-modal" class="prompt-modal" aria-hidden="true">
      <div class="prompt-card">
        <div class="prompt-header">
          <div>
            <h2 class="prompt-title">${escapeHtml(promptTitle)}</h2>
            <p class="prompt-subtitle">${escapeHtml(options.promptSubtitle)}</p>
          </div>
          <div class="prompt-actions">
            <button type="button" id="prompt-clear" class="btn-secondary prompt-clear-btn" title="${escapeHtml(options.clearButtonTitle)}">Clear</button>
            <button type="button" id="prompt-copy" class="copy-button">
              <svg aria-hidden="true" viewBox="0 0 448 512" fill="currentColor"><path d="M384 336l-192 0c-35.3 0-64-28.7-64-64l0-192c0-17.7 14.3-32 32-32l140.1 0L416 163.9 416 304c0 17.7-14.3 32-32 32zM128 368c0 17.7 14.3 32 32 32l224 0c35.3 0 64-28.7 64-64l0-140.1c0-17-6.7-33.3-18.7-45.3L313.4 34.7c-12-12-28.3-18.7-45.3-18.7L160 16c-35.3 0-64 28.7-64 64l0 16-32 0c-35.3 0-64 28.7-64 64L0 384c0 61.9 50.1 112 112 112l208 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-208 0c-26.5 0-48-21.5-48-48l0-224 32 0 0 112c0 53 43 96 96 96l112 0 0 16z"/></svg>
              <span>Copy</span>
            </button>
            <button type="button" id="prompt-close" class="prompt-close" aria-label="Close prompt" title="Close prompt">&#215;</button>
          </div>
        </div>
        <textarea id="prompt-textarea" class="prompt-textarea" spellcheck="false"></textarea>
        <p id="prompt-copy-status" class="prompt-copy-status" aria-live="polite"></p>
      </div>
    </div>
`;
}

export function renderSlideReviewAnnotationRuntime(): string {
  return `
      const SlideReviewShared = (() => {
        function clamp(value, min, max) {
          return Math.min(Math.max(value, min), max);
        }

        function roundToTenths(value) {
          return Math.round(value * 10) / 10;
        }

        function formatPercent(value) {
          return roundToTenths(value).toFixed(1) + "%";
        }

        function describeBand(yPercent) {
          if (yPercent < 20) {
            return "top band";
          }

          if (yPercent > 80) {
            return "bottom band";
          }

          return "main content area";
        }

        function describeRegion(xPercent, yPercent) {
          const horizontal =
            xPercent < 33.34 ? "left" : xPercent > 66.66 ? "right" : "centre";
          const vertical =
            yPercent < 33.34 ? "top" : yPercent > 66.66 ? "bottom" : "middle";

          if (horizontal === "centre" && vertical === "middle") {
            return "centre";
          }

          if (horizontal === "centre") {
            return vertical + "-centre";
          }

          if (vertical === "middle") {
            return "middle-" + horizontal;
          }

          return vertical + "-" + horizontal;
        }

        function createCommentId() {
          return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8);
        }

        function createSlideReviewAnnotations(config) {
          const pagePrimary = document.getElementById("page-primary");
          const pageClear = document.getElementById("page-clear");
          const annotationEditor = document.getElementById("annotation-editor");
          const annotationTitle = document.getElementById("annotation-editor-title");
          const annotationMeta = document.getElementById("annotation-editor-meta");
          const annotationText = document.getElementById("annotation-text");
          const annotationSave = document.getElementById("annotation-save");
          const annotationCancel = document.getElementById("annotation-cancel");
          const annotationDelete = document.getElementById("annotation-delete");
          const annotationClose = document.getElementById("annotation-close");
          const promptModal = document.getElementById("prompt-modal");
          const promptTextarea = document.getElementById("prompt-textarea");
          const promptCopy = document.getElementById("prompt-copy");
          const promptClear = document.getElementById("prompt-clear");
          const promptClose = document.getElementById("prompt-close");
          const promptCopyStatus = document.getElementById("prompt-copy-status");
          const utils = {
            clamp,
            createCommentId,
            describeBand,
            describeRegion,
            formatPercent,
            roundToTenths,
          };
          let comments = [];
          let editorState = null;
          let initialised = false;

          function loadComments() {
            try {
              const raw = localStorage.getItem(config.commentStorageKey);
              if (!raw) {
                return [];
              }

              const parsed = JSON.parse(raw);
              if (!Array.isArray(parsed)) {
                return [];
              }

              return parsed
                .map((comment) => {
                  if (typeof config.normaliseComment === "function") {
                    return config.normaliseComment(comment, utils);
                  }

                  return comment && typeof comment === "object" ? comment : null;
                })
                .filter((comment) => Boolean(comment));
            } catch (_error) {
              return [];
            }
          }

          function persistComments() {
            try {
              localStorage.setItem(config.commentStorageKey, JSON.stringify(comments));
            } catch (_error) {}
          }

          function resetEditor() {
            annotationEditor.hidden = true;
            annotationEditor.style.visibility = "";
            if (annotationEditor.parentElement) {
              annotationEditor.parentElement.removeChild(annotationEditor);
            }
            editorState = null;
            annotationText.value = "";
          }

          function updatePrimaryActionButton() {
            if (comments.length === 0) {
              pagePrimary.hidden = true;
              pageClear.hidden = true;
              pagePrimary.textContent = config.primaryActionLabel;
              return;
            }

            pagePrimary.hidden = false;
            pageClear.hidden = false;
            pagePrimary.textContent =
              typeof config.formatPrimaryActionLabel === "function"
                ? config.formatPrimaryActionLabel(comments.length, config.primaryActionLabel)
                : config.primaryActionLabel + " (" + comments.length + ")";
          }

          function createMarkerButton(comment, index, handleClick) {
            const marker = document.createElement("button");
            marker.type = "button";
            marker.className = "comment-marker";
            marker.textContent = String(index + 1);
            marker.style.left = comment.xPercent + "%";
            marker.style.top = comment.yPercent + "%";
            marker.title = "Comment " + (index + 1) + ": " + comment.text;
            marker.addEventListener("click", handleClick);
            return marker;
          }

          function renderMarkers() {
            config.renderMarkers({
              comments,
              createMarkerButton,
              openExistingComment,
            });
            updatePrimaryActionButton();
          }

          function closeEditor(reason) {
            if (!editorState) {
              return true;
            }

            if (reason === "cancel" || reason === "switch") {
              const message = editorState.commentId
                ? config.discardExistingConfirmText || "Discard changes?"
                : config.discardDraftConfirmText || "Discard this draft?";

              if (!window.confirm(message)) {
                return false;
              }
            }

            resetEditor();
            return true;
          }

          function positionEditor(host, anchorX, anchorY) {
            annotationEditor.style.left = "12px";
            annotationEditor.style.top = "12px";
            annotationEditor.style.visibility = "hidden";

            requestAnimationFrame(() => {
              const margin = 12;
              const maxLeft = Math.max(
                margin,
                host.clientWidth - annotationEditor.offsetWidth - margin
              );
              const maxTop = Math.max(
                margin,
                host.clientHeight - annotationEditor.offsetHeight - margin
              );

              annotationEditor.style.left =
                clamp(anchorX + 12, margin, maxLeft) + "px";
              annotationEditor.style.top =
                clamp(anchorY + 12, margin, maxTop) + "px";
              annotationEditor.style.visibility = "visible";
              annotationText.focus();
            });
          }

          function openCommentEditor(options) {
            if (!closeEditor("switch")) {
              return false;
            }

            const host = config.getEditorHost(options);
            const copy = config.getEditorCopy(options, utils);

            if (!host || !copy) {
              return false;
            }

            editorState = options;
            annotationTitle.textContent = copy.title;
            annotationMeta.textContent = copy.meta;
            annotationText.value = options.text || "";
            annotationDelete.hidden = !options.commentId;

            host.appendChild(annotationEditor);
            annotationEditor.hidden = false;
            positionEditor(host, options.anchorX, options.anchorY);
            return true;
          }

          function openExistingComment(commentId) {
            const comment = comments.find((entry) => entry.id === commentId);
            if (!comment) {
              return false;
            }

            const host = config.getEditorHost(comment);
            if (!host) {
              if (typeof config.onMissingExistingCommentHost === "function") {
                config.onMissingExistingCommentHost(commentId, comment);
              }
              return false;
            }

            return openCommentEditor({
              ...comment,
              anchorX: (comment.xPercent / 100) * host.clientWidth,
              anchorY: (comment.yPercent / 100) * host.clientHeight,
            });
          }

          function saveComment() {
            if (!editorState) {
              return;
            }

            const text = annotationText.value.trim();
            if (!text) {
              window.alert(config.emptyCommentAlertText || "Add a comment first, or cancel.");
              annotationText.focus();
              return;
            }

            if (editorState.commentId) {
              comments = comments.map((comment) =>
                comment.id === editorState.commentId
                  ? { ...comment, text }
                  : comment
              );
            } else {
              const themeLabel =
                typeof config.getThemeLabel === "function"
                  ? config.getThemeLabel()
                  : "light";

              comments.push(
                config.createComment(editorState, text, themeLabel, utils)
              );
            }

            persistComments();
            renderMarkers();
            resetEditor();
          }

          function deleteComment() {
            if (!editorState || !editorState.commentId) {
              return;
            }

            if (!window.confirm(config.deleteCommentConfirmText || "Delete this comment?")) {
              return;
            }

            comments = comments.filter((comment) => comment.id !== editorState.commentId);
            persistComments();
            renderMarkers();
            resetEditor();
          }

          function openPromptModal() {
            promptTextarea.value = config.buildPromptText(comments.slice());
            promptCopyStatus.textContent = "";
            promptModal.classList.add("open");
            promptModal.setAttribute("aria-hidden", "false");
            promptTextarea.focus();
          }

          function closePromptModal() {
            promptModal.classList.remove("open");
            promptModal.setAttribute("aria-hidden", "true");
          }

          function clearAllComments() {
            if (!window.confirm(config.clearConfirmText || "Clear all comments? This cannot be undone.")) {
              return;
            }

            comments = [];
            persistComments();
            renderMarkers();
            if (!annotationEditor.hidden) {
              resetEditor();
            }
            if (promptModal.classList.contains("open")) {
              closePromptModal();
            }
          }

          async function copyPrompt() {
            const value = promptTextarea.value;

            try {
              await navigator.clipboard.writeText(value);
              promptCopyStatus.textContent = config.copySuccessText || "Copied.";
            } catch (_error) {
              promptTextarea.focus();
              promptTextarea.select();
              const copied = document.execCommand("copy");
              promptCopyStatus.textContent = copied
                ? config.copySuccessText || "Copied."
                : config.copyFailureText || "Copy failed. Select the text manually and copy it.";
            }
          }

          function bindEvents() {
            annotationEditor.addEventListener("click", (event) => {
              event.stopPropagation();
            });
            annotationSave.addEventListener("click", saveComment);
            annotationCancel.addEventListener("click", () => {
              closeEditor("cancel");
            });
            annotationClose.addEventListener("click", () => {
              closeEditor("cancel");
            });
            annotationDelete.addEventListener("click", deleteComment);
            pagePrimary.addEventListener("click", () => {
              if (!closeEditor("switch")) {
                return;
              }

              openPromptModal();
            });
            pageClear.addEventListener("click", clearAllComments);
            promptClear.addEventListener("click", clearAllComments);
            promptCopy.addEventListener("click", copyPrompt);
            promptClose.addEventListener("click", closePromptModal);
            promptModal.addEventListener("click", (event) => {
              if (event.target === promptModal) {
                closePromptModal();
              }
            });

            document.addEventListener("keydown", (event) => {
              if (event.key !== "Escape") {
                return;
              }

              if (promptModal.classList.contains("open")) {
                event.preventDefault();
                closePromptModal();
                return;
              }

              if (!annotationEditor.hidden) {
                event.preventDefault();
                closeEditor("cancel");
                return;
              }

              if (typeof config.onEscape === "function") {
                config.onEscape(event);
              }
            });
          }

          return {
            clamp,
            createCommentId,
            describeBand,
            describeRegion,
            formatPercent,
            init() {
              if (!initialised) {
                bindEvents();
                initialised = true;
              }

              comments = loadComments();
              renderMarkers();
            },
            isEditorInHost(host) {
              return annotationEditor.parentElement === host;
            },
            isEditorOpen() {
              return !annotationEditor.hidden;
            },
            isPromptOpen() {
              return promptModal.classList.contains("open");
            },
            openCommentEditor,
            openExistingComment,
            closeEditor,
            closePromptModal,
            openPromptModal,
            renderMarkers,
            repositionEditor() {
              if (!editorState) {
                return;
              }

              const host = config.getEditorHost(editorState);
              if (!host) {
                return;
              }

              positionEditor(
                host,
                (editorState.xPercent / 100) * host.clientWidth,
                (editorState.yPercent / 100) * host.clientHeight
              );
            },
            roundToTenths,
          };
        }

        return {
          clamp,
          createCommentId,
          createSlideReviewAnnotations,
          describeBand,
          describeRegion,
          formatPercent,
          roundToTenths,
        };
      })();
`;
}
