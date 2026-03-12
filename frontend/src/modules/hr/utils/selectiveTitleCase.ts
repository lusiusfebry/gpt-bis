import type { ChangeEvent } from "react";

const LOWERCASE_WORD_EXCEPTIONS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "per",
  "the",
  "to",
  "vs",
  "via",
]);

function isAllUppercaseWord(word: string) {
  const lettersOnly = word.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/g, "");

  if (!lettersOnly) {
    return false;
  }

  return lettersOnly === lettersOnly.toUpperCase();
}

function capitalizeWord(word: string, index: number, totalWords: number) {
  if (!word) {
    return word;
  }

  if (isAllUppercaseWord(word)) {
    return word;
  }

  const lowerCasedWord = word.toLocaleLowerCase();
  const shouldKeepLowercase =
    index > 0 &&
    index < totalWords - 1 &&
    LOWERCASE_WORD_EXCEPTIONS.has(lowerCasedWord);

  if (shouldKeepLowercase) {
    return lowerCasedWord;
  }

  return lowerCasedWord.charAt(0).toLocaleUpperCase() + lowerCasedWord.slice(1);
}

export function toSelectiveTitleCase(value?: string | null) {
  if (value == null) {
    return value;
  }

  const words = value.match(/\S+/g) ?? [];
  let wordIndex = 0;

  return value.replace(/\S+/g, (word) => {
    const normalizedWord = capitalizeWord(word, wordIndex, words.length);
    wordIndex += 1;
    return normalizedWord;
  });
}

export function applySelectiveTitleCaseToEvent<T extends HTMLInputElement | HTMLTextAreaElement>(
  event: ChangeEvent<T>,
) {
  return toSelectiveTitleCase(event.target.value) ?? "";
}
