import { NextResponse } from "next/server";
import { getTranslatedWord, WordServiceError } from "@/lib/word.server";
import type { WordApiErrorResponse, WordApiResponse } from "@/types/word";

const headers = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const word = await getTranslatedWord(request.signal);
    return NextResponse.json<WordApiResponse>(word, { headers });
  } catch (cause) {
    const error =
      cause instanceof WordServiceError
        ? cause.message
        : "Сервис слов временно недоступен. Попробуйте снова.";

    return NextResponse.json<WordApiErrorResponse>(
      { error },
      { status: 502, headers },
    );
  }
}
