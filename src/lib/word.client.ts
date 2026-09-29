import type { WordApiResponse } from "@/types/word";

function isWordApiResponse(value: unknown): value is WordApiResponse {
  if (typeof value !== "object" || value === null) return false;

  return (
    "word" in value &&
    typeof value.word === "string" &&
    value.word.trim().length > 0 &&
    "translation" in value &&
    typeof value.translation === "string" &&
    value.translation.trim().length > 0
  );
}

export async function fetchWord(signal: AbortSignal): Promise<WordApiResponse> {
  const response = await fetch("/api/word", {
    cache: "no-store",
    signal,
  }).catch(() => {
    throw new Error(
      "Не удалось загрузить слово. Проверьте соединение и попробуйте снова.",
    );
  });
  const data: unknown = await response.json().catch(() => {
    throw new Error("Сервер вернул некорректный ответ. Попробуйте снова.");
  });

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "error" in data &&
      typeof data.error === "string" &&
      data.error.trim()
        ? data.error
        : "Не удалось загрузить слово. Попробуйте снова.";
    throw new Error(message);
  }

  if (!isWordApiResponse(data)) {
    throw new Error("Получена некорректная карточка. Попробуйте снова.");
  }

  return data;
}
