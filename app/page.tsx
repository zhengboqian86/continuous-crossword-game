"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ClueData {
  clue: string;
  answer: string;
  length: number;
}

type FeedbackType = "correct" | "wrong" | null;

export default function Home() {
  const [clueData, setClueData] = useState<ClueData | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchClue = useCallback(async () => {
    setLoading(true);
    setInput("");
    setFeedback(null);
    try {
      const res = await fetch("/api/clue");
      const data = await res.json();
      setClueData(data);
    } catch {
      // silent fail, keep old clue
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClue();
  }, [fetchClue]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading, clueData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clueData || loading) return;

    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === clueData.answer.toLowerCase()) {
      setScore((s) => s + 10);
      setStreak((s) => s + 1);
      setFeedback("correct");
      setTimeout(() => fetchClue(), 1000);
    } else {
      setStreak(0);
      setFeedback("wrong");
      setTimeout(() => {
        setFeedback(null);
        inputRef.current?.focus();
      }, 800);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
            Continuous Crossword
          </h1>
          <p className="text-purple-300 text-sm">Guess the word from the clue</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-purple-300 text-xs mt-1 uppercase tracking-wider">Score</div>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {streak > 0 ? `🔥 ${streak}` : streak}
            </div>
            <div className="text-purple-300 text-xs mt-1 uppercase tracking-wider">Streak</div>
          </div>
        </div>

        {/* Game Card */}
        <div
          className={`bg-white/10 backdrop-blur rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
            feedback === "correct"
              ? "ring-2 ring-green-400 bg-green-500/20"
              : feedback === "wrong"
              ? "ring-2 ring-red-400 bg-red-500/20"
              : ""
          }`}
        >
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-purple-300 mt-3 text-sm">Loading clue...</p>
            </div>
          ) : (
            <>
              {/* Clue */}
              <div className="mb-6">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-2">Clue</p>
                <p className="text-white text-xl font-medium leading-relaxed">
                  {clueData?.clue}
                </p>
              </div>

              {/* Letter count hint */}
              <div className="mb-6">
                <p className="text-purple-300 text-xs uppercase tracking-wider mb-2">
                  Letters
                </p>
                <div className="flex gap-1.5">
                  {Array.from({ length: clueData?.length ?? 0 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 border-2 border-purple-400/50 rounded-lg bg-white/5"
                    />
                  ))}
                </div>
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={feedback === "correct"}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-lg transition-all"
                  autoComplete="off"
                  autoCapitalize="none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || feedback === "correct"}
                  className="w-full bg-purple-500 hover:bg-purple-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95"
                >
                  Submit
                </button>
              </form>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`mt-4 text-center font-semibold text-lg transition-all ${
                    feedback === "correct" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {feedback === "correct" ? "✓ Correct! +10" : "✗ Try again"}
                </div>
              )}
            </>
          )}
        </div>

        {/* Skip button */}
        {!loading && feedback !== "correct" && (
          <div className="text-center mt-4">
            <button
              onClick={fetchClue}
              className="text-purple-400 hover:text-purple-200 text-sm transition-colors"
            >
              Skip this word →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
