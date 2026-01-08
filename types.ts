
export enum TranslationMode {
  TEXT_TO_MORSE = 'TEXT_TO_MORSE',
  MORSE_TO_TEXT = 'MORSE_TO_TEXT'
}

export interface MorseMapping {
  [key: string]: string;
}

export interface HistoryItem {
  id: string;
  original: string;
  translated: string;
  timestamp: number;
}
