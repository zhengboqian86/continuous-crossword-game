"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ClueData {
  clue: string;
  answer: string;
  length: number;
}

interface UserSession {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

type FeedbackType = "correct" | "wrong" | null;

export default function Home() {
  const [clueData, setClueData] = useState<ClueData | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<UserSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // 获取登录状态
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        setSession(data);
        setSessionLoading(false);
      })
      .catch(() => setSessionLoading(false));
  }, []);

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
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-1 tracking-tight">
            Continuous Crossword
          </h1>
          <p className="text-purple-300 text-sm">Guess the word from the clue</p>
        </div>

        {/* Auth Bar */}
        <div className="flex justify-end mb-4 min-h-[36px]">
          {!sessionLoading && (
            session?.user ? (
              <div className="flex items-center gap-3">
                {session.user.image && (
                  <img
                    src={session.user.image}
                    className="w-8 h-8 rounded-full border-2 border-purple-400/50"
                    alt="avatar"
                  />
                )}
                <span className="text-purple-200 text-sm font-medium">
                  {session.user.name}
                </span>
                <button
                  onClick={() => window.location.href = '/api/auth/signout?callbackUrl=/'}
                  className="text-purple-400 hover:text-white text-xs border border-purple-400/40 rounded-lg px-3 py-1.5 transition-colors hover:border-purple-300"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => window.location.href = '/api/auth/signin/google?callbackUrl=/'}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded-xl text-sm transition-colors shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            )
          )}
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
