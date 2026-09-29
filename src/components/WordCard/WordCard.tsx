"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { WordData } from "@/types/word";
import styles from "./WordCard.module.scss";

interface WordCardProps {
  card: WordData | null;
  isFlipped: boolean;
  isLoading: boolean;
  onFlip: () => void;
  hintId: string;
}

export default function WordCard({
  card,
  isFlipped,
  isLoading,
  onFlip,
  hintId,
}: WordCardProps) {
  const innerRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animation = gsap.to(innerRef.current, {
      rotationY: isFlipped ? 180 : 0,
      duration: reducedMotion.matches || isLoading ? 0 : 0.55,
      ease: "power2.inOut",
      overwrite: "auto",
    });

    const finishAnimation = () => {
      if (reducedMotion.matches) animation.progress(1);
    };
    reducedMotion.addEventListener("change", finishAnimation);

    return () => {
      reducedMotion.removeEventListener("change", finishAnimation);
      animation.kill();
    };
  }, [isFlipped, isLoading]);

  return (
    <button
      className={styles.card}
      type="button"
      disabled={isLoading || !card}
      aria-pressed={isFlipped}
      aria-describedby={hintId}
      onClick={onFlip}
    >
      <span className={styles.inner} ref={innerRef}>
        <span className={styles.face} aria-hidden={isFlipped}>
          <span className={styles.language}>Английское слово</span>
          <span className={styles.text} lang="en">
            {isLoading || !card ? "…" : card.word}
          </span>
          <span className={styles.action}>Показать перевод</span>
        </span>
        <span className={`${styles.face} ${styles.back}`} aria-hidden={!isFlipped}>
          <span className={styles.language}>Русский перевод</span>
          <span className={styles.text} lang="ru">
            {isLoading || !card ? "…" : card.translation}
          </span>
          <span className={styles.action}>Показать слово</span>
        </span>
      </span>
    </button>
  );
}
