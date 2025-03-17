"use client";

import { useState, useRef, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import "highlight.js/lib/languages/markdown";
import styles from "./styles.module.scss";

interface EditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
}

export function Editor({
  initialValue = "# Hello\n\nEdit your slides here",
  onChange,
}: EditorProps) {
  const [markdown, setMarkdown] = useState(initialValue);
  const [highlighted, setHighlighted] = useState("");


  useEffect(() => {
    hljs.configure({
      languages: ["markdown"],
      cssSelector: "pre code",
    });

    const highlighted = hljs.highlight(markdown, {
      language: "markdown",
    }).value;
    setHighlighted(highlighted);
    onChange?.(markdown);
  }, [markdown, onChange]);

  return (
    <>
      <div
        className={styles.highlightWrapper}
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
      <textarea
        className={styles.textArea}
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        placeholder="Enter your markdown here..."
        spellCheck={false}
      />
    </>
  );
}
