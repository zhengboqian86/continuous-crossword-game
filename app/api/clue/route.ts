import { NextResponse } from "next/server";

// Fallback word list in case Datamuse API fails
const FALLBACK_CLUES = [
  { clue: "A domestic animal that meows", answer: "cat", length: 3 },
  { clue: "Man's best friend", answer: "dog", length: 3 },
  { clue: "Opposite of night", answer: "day", length: 3 },
  { clue: "Frozen water", answer: "ice", length: 3 },
  { clue: "The color of the sky", answer: "blue", length: 4 },
  { clue: "A large body of salt water", answer: "ocean", length: 5 },
  { clue: "Shines in the sky at night", answer: "moon", length: 4 },
  { clue: "Gives light and heat to Earth", answer: "sun", length: 3 },
  { clue: "Falls from clouds as precipitation", answer: "rain", length: 4 },
  { clue: "A book of maps", answer: "atlas", length: 5 },
  { clue: "A musical instrument with keys", answer: "piano", length: 5 },
  { clue: "Used to write or draw", answer: "pencil", length: 6 },
  { clue: "A place to borrow books", answer: "library", length: 7 },
  { clue: "The season after summer", answer: "autumn", length: 6 },
  { clue: "A sweet food made by bees", answer: "honey", length: 5 },
];

async function fetchFromDatamuse(): Promise<{
  clue: string;
  answer: string;
  length: number;
} | null> {
  try {
    // Get a random common word with definitions
    const topics = ["nature", "animals", "food", "science", "art"];
    const topic = topics[Math.floor(Math.random() * topics.length)];

    const res = await fetch(
      `https://api.datamuse.com/words?topics=${topic}&md=d&max=50`,
      { signal: AbortSignal.timeout(3000) }
    );

    if (!res.ok) return null;

    const words = await res.json();

    // Filter words that have definitions and reasonable length
    const candidates = words.filter(
      (w: { word: string; defs?: string[] }) =>
        w.defs &&
        w.defs.length > 0 &&
        w.word.length >= 3 &&
        w.word.length <= 8 &&
        /^[a-z]+$/.test(w.word)
    );

    if (candidates.length === 0) return null;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    // Clean up the definition (remove part-of-speech prefix like "n\t" or "v\t")
    const rawDef: string = picked.defs[0];
    const clue = rawDef.replace(/^[a-z]+\t/, "");

    return {
      clue: clue.charAt(0).toUpperCase() + clue.slice(1),
      answer: picked.word,
      length: picked.word.length,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const result = await fetchFromDatamuse();

  if (result) {
    return NextResponse.json(result);
  }

  // Fallback
  const fallback =
    FALLBACK_CLUES[Math.floor(Math.random() * FALLBACK_CLUES.length)];
  return NextResponse.json(fallback);
}
