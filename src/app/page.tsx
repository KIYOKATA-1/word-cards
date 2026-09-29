import WordTrainer from "@/components/WordTrainer/WordTrainer";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Английский · шаг за шагом</p>
        <h1>Карточки слов</h1>
        <p className={styles.description}>
          Вспомните перевод, переверните карточку и проверьте себя.
        </p>
      </header>
      <WordTrainer />
      <footer className={styles.footer}>Одно слово — маленький шаг вперёд.</footer>
    </main>
  );
}
