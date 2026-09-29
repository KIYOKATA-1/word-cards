import "server-only";

import type { WordData } from "@/types/word";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export class WordServiceError extends Error {}

export async function getTranslatedWord(signal: AbortSignal): Promise<WordData> {
  let failureMessage = "Сервис слов временно недоступен. Попробуйте снова.";

  try {
    const wordResponse = await fetch(
      "https://random-word-api.herokuapp.com/word?number=1&diff=1",
      {
        cache: "no-store",
        signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
      },
    );

    if (!wordResponse.ok) {
      throw new WordServiceError(failureMessage);
    }

    const words: unknown = await wordResponse.json();

    if (
      !Array.isArray(words) ||
      words.length !== 1 ||
      typeof words[0] !== "string" ||
      !/^[a-z]+(?:['-][a-z]+)*$/i.test(words[0].trim())
    ) {
      throw new WordServiceError("Сервис слов вернул некорректное слово. Попробуйте снова.");
    }

    const word = words[0].trim();
    const translationUrl = new URL("https://api.mymemory.translated.net/get");
    translationUrl.search = new URLSearchParams({
      q: word,
      langpair: "en|ru",
    }).toString();
    failureMessage = "Сервис перевода временно недоступен. Попробуйте снова.";

    const translationResponse = await fetch(translationUrl, {
      cache: "no-store",
      signal: AbortSignal.any([signal, AbortSignal.timeout(12_000)]),
    });

    if (!translationResponse.ok) {
      throw new WordServiceError(failureMessage);
    }

    const data: unknown = await translationResponse.json();

    if (
      !isRecord(data) ||
      (data.responseStatus !== 200 && data.responseStatus !== "200") ||
      data.quotaFinished === true
    ) {
      throw new WordServiceError(failureMessage);
    }

    if (
      !isRecord(data.responseData) ||
      typeof data.responseData.translatedText !== "string"
    ) {
      throw new WordServiceError("Сервис перевода вернул некорректный ответ. Попробуйте снова.");
    }

    const translation = data.responseData.translatedText.trim();

    if (!translation || translation.toLowerCase() === word.toLowerCase()) {
      throw new WordServiceError("Для этого слова не найден перевод. Попробуйте снова.");
    }

    return { word, translation };
  } catch (cause) {
    if (cause instanceof WordServiceError) throw cause;

    throw new WordServiceError(failureMessage);
  }
}
