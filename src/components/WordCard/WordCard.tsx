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
  return (
    <button
      className={styles.card}
      type="button"
      disabled={isLoading || !card}
      aria-pressed={isFlipped}
      aria-describedby={hintId}
      onClick={onFlip}
    >
      <span className={styles.language}>
        {isFlipped ? "Русский перевод" : "Английское слово"}
      </span>
      <span className={styles.text} lang={isFlipped ? "ru" : "en"}>
        {isLoading || !card ? "…" : isFlipped ? card.translation : card.word}
      </span>
      <span className={styles.action}>
        {isFlipped ? "Показать слово" : "Показать перевод"}
      </span>
    </button>
  );
}
