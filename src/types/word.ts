export interface WordData {
  word: string;
  translation: string;
}

export type WordApiResponse = WordData;

export interface WordApiErrorResponse {
  error: string;
}
