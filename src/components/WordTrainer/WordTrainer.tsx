"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { fetchWord } from "@/lib/word.client";
import type { WordData } from "@/types/word";
import WordCard from "@/components/WordCard/WordCard";
import TrainerError from "@/components/TrainerError/TrainerError";
import styles from "./WordTrainer.module.scss";

export default function WordTrainer() {
  const [card, setCard] = useState<WordData | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hintId = useId();
  const activeRequest = useRef<AbortController | null>(null);

  const loadWord = useCallback(async () => {
    if (activeRequest.current) return;

    const controller = new AbortController();
    activeRequest.current = controller;
    setIsLoading(true);
    setError(null);
    setIsFlipped(false);

    try {
      const data = await fetchWord(controller.signal);

      if (!controller.signal.aborted) setCard(data);
    } catch (cause) {
      if (controller.signal.aborted) return;

      setError(
        cause instanceof Error && cause.message
          ? cause.message
          : "Не удалось загрузить слово. Проверьте соединение и попробуйте снова.",
      );
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadWord(), 0);

    return () => {
      window.clearTimeout(timer);
      activeRequest.current?.abort();
      activeRequest.current = null;
    };
  }, [loadWord]);

  return (
    <section className={styles.trainer} aria-label="Тренировка английских слов">
      <div className={styles.status} role="status" aria-atomic="true">
        {isLoading ? "Загружаем слово и перевод…" : ""}
      </div>

      {error ? (
        <TrainerError message={error} />
      ) : (
        <WordCard
          card={card}
          isFlipped={isFlipped}
          isLoading={isLoading}
          hintId={hintId}
          onFlip={() => setIsFlipped((flipped) => !flipped)}
        />
      )}

      <p className={styles.hint} id={hintId}>
        Нажмите на карточку или используйте Enter / пробел, чтобы её перевернуть.
      </p>

      <button
        className={styles.next}
        type="button"
        disabled={isLoading}
        onClick={() => void loadWord()}
      >
        {isLoading ? "Загрузка…" : error ? "Попробовать снова" : "Следующее слово"}
      </button>
    </section>
  );
}
