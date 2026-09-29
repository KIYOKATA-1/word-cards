export interface WordData {
  word: string;
  translation: string;
}

/** Успешный ответ GET /api/word. */
export type WordApiResponse = WordData;

/** Ответ GET /api/word при ошибке. */
export interface WordApiErrorResponse {
  error: string;
}
