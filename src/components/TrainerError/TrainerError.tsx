import styles from "./TrainerError.module.scss";

interface TrainerErrorProps {
  message: string;
}

export default function TrainerError({ message }: TrainerErrorProps) {
  return (
    <div className={styles.error} role="alert">
      <h2>Не получилось загрузить карточку</h2>
      <p>{message}</p>
    </div>
  );
}
