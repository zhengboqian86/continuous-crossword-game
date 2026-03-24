import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Continuous Crossword",
  description: "Guess the word from the clue — keep your streak going!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
