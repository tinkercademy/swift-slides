"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.scss";

export function SplitView({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.classList.add(styles.dragging);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !editorRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const minWidth = 200;
      const maxWidth = containerRect.width * 0.8;

      let newWidth = e.clientX - containerRect.left;
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      editorRef.current.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.classList.remove(styles.dragging);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.editorPane} ref={editorRef}>
        {left}
      </div>
      <div className={styles.divider} onMouseDown={handleMouseDown} />
      <div className={styles.previewPane}>{right}</div>
    </div>
  );
}
