"use client";

import { useState, useEffect, useCallback } from "react";
import { RotateCcw } from "lucide-react";

type Definition = {
  _id: string;
  title: string;
  description: string;
};

type CardType = "term" | "definition";

type Card = {
  id: string;
  type: CardType;
  content: string;
  definitionId: string;
};

type PairingGameProps = {
  definitions: Definition[];
};

export function PairingGame({ definitions }: PairingGameProps) {
  const [termCards, setTermCards] = useState<Card[]>([]);
  const [definitionCards, setDefinitionCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [gameWon, setGameWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null);

  // Initialize game cards
  useEffect(() => {
    if (definitions.length === 0) return;

    const terms: Card[] = definitions.map((def) => ({
      id: `term-${def._id}`,
      type: "term" as CardType,
      content: def.title,
      definitionId: def._id,
    }));

    const definitionsList: Card[] = definitions.map((def) => ({
      id: `def-${def._id}`,
      type: "definition" as CardType,
      content: def.description,
      definitionId: def._id,
    }));

    // Shuffle each group separately
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5);
    const shuffledDefinitions = [...definitionsList].sort(() => Math.random() - 0.5);

    setTermCards(shuffledTerms);
    setDefinitionCards(shuffledDefinitions);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setGameWon(false);
    setAttempts(0);
    setShowFeedback(null);
  }, [definitions]);

  const handleCardClick = useCallback(
    (cardId: string) => {
      const allCards = [...termCards, ...definitionCards];
      const card = allCards.find((c) => c.id === cardId);
      if (!card) return;

      // Don't allow clicking already matched cards
      if (matchedPairs.has(card.definitionId)) return;

      // Don't allow clicking the same card twice
      if (selectedCards.includes(cardId)) return;

      // Don't allow clicking more than 2 cards
      if (selectedCards.length >= 2) return;

      const newSelected = [...selectedCards, cardId];
      setSelectedCards(newSelected);

      // Check for match when 2 cards are selected
      if (newSelected.length === 2) {
        setAttempts((prev) => prev + 1);

        const [firstId, secondId] = newSelected;
        const firstCard = allCards.find((c) => c.id === firstId);
        const secondCard = allCards.find((c) => c.id === secondId);

        if (
          firstCard &&
          secondCard &&
          firstCard.type !== secondCard.type &&
          firstCard.definitionId === secondCard.definitionId
        ) {
          // Match found!
          setMatchedPairs((prev) => new Set([...prev, firstCard.definitionId]));
          setShowFeedback("correct");
          setTimeout(() => {
            setSelectedCards([]);
            setShowFeedback(null);
          }, 1000);
        } else {
          // No match
          setShowFeedback("incorrect");
          setTimeout(() => {
            setSelectedCards([]);
            setShowFeedback(null);
          }, 1000);
        }
      }
    },
    [termCards, definitionCards, selectedCards, matchedPairs]
  );

  // Check if game is won
  useEffect(() => {
    if (definitions.length > 0 && matchedPairs.size === definitions.length) {
      setGameWon(true);
    }
  }, [matchedPairs.size, definitions.length]);

  const resetGame = () => {
    const terms: Card[] = definitions.map((def) => ({
      id: `term-${def._id}`,
      type: "term" as CardType,
      content: def.title,
      definitionId: def._id,
    }));

    const definitionsList: Card[] = definitions.map((def) => ({
      id: `def-${def._id}`,
      type: "definition" as CardType,
      content: def.description,
      definitionId: def._id,
    }));

    // Shuffle each group separately
    const shuffledTerms = [...terms].sort(() => Math.random() - 0.5);
    const shuffledDefinitions = [...definitionsList].sort(() => Math.random() - 0.5);

    setTermCards(shuffledTerms);
    setDefinitionCards(shuffledDefinitions);
    setSelectedCards([]);
    setMatchedPairs(new Set());
    setGameWon(false);
    setAttempts(0);
    setShowFeedback(null);
  };

  const isCardSelected = (cardId: string) => selectedCards.includes(cardId);
  const isCardMatched = (cardId: string) => {
    const allCards = [...termCards, ...definitionCards];
    const card = allCards.find((c) => c.id === cardId);
    return card ? matchedPairs.has(card.definitionId) : false;
  };

  if (termCards.length === 0 || definitionCards.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-300/60 bg-white/90 p-8 text-center shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
        <p className="text-lg text-green-900 dark:text-white/70">
          Laster spill...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game stats */}
      <div className="flex items-center justify-between rounded-2xl border border-amber-300/60 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-amber-700/50 dark:bg-green-950/80">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-base text-green-900 dark:text-white/60">
              Forsøk
            </p>
            <p className="text-2xl font-bold text-green-950 dark:text-white">
              {attempts}
            </p>
          </div>
          <div className="text-center">
            <p className="text-base text-green-900 dark:text-white/60">
              Matched
            </p>
            <p className="text-2xl font-bold text-green-950 dark:text-white">
              {matchedPairs.size} / {definitions.length}
            </p>
          </div>
        </div>
        <button
          onClick={resetGame}
          className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-green-950 transition-colors hover:bg-amber-600"
        >
          <RotateCcw size={16} />
          Start på nytt
        </button>
      </div>

      {/* Feedback message */}
      {showFeedback && (
        <div
          className={`mx-auto max-w-md rounded-lg p-4 text-center text-lg font-semibold ${
            showFeedback === "correct"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}
        >
          {showFeedback === "correct" ? "✓ Riktig!" : "✗ Feil, prøv igjen!"}
        </div>
      )}

      {/* Win message */}
      {gameWon && (
        <div className="mx-auto max-w-md rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 p-6 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white">🎉 Gratulerer!</h2>
          <p className="mt-2 text-lg text-white">
            Du klarte alle parringene på {attempts} forsøk!
          </p>
        </div>
      )}

      {/* Terms section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Begrep</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {termCards.map((card) => {
            const selected = isCardSelected(card.id);
            const matched = isCardMatched(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={matched || selectedCards.length === 2}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  matched
                    ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                    : selected
                      ? "border-amber-500 bg-amber-100 shadow-lg dark:bg-amber-900/30"
                      : "border-amber-300/60 bg-white/95 hover:border-amber-400 hover:shadow-md dark:border-amber-700/50 dark:bg-green-950/85 dark:hover:border-amber-600"
                } ${
                  matched || selectedCards.length === 2
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
              >
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-green-900 dark:text-white/60">
                  Begrep
                </div>
                <div
                  className={`text-base font-medium ${
                    matched
                      ? "text-green-900 dark:text-green-100"
                      : selected
                        ? "text-amber-900 dark:text-amber-100"
                        : "text-green-950 dark:text-white"
                  } font-bold text-lg`}
                >
                  {card.content}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Definitions section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Definisjoner</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {definitionCards.map((card) => {
            const selected = isCardSelected(card.id);
            const matched = isCardMatched(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={matched || selectedCards.length === 2}
                className={`rounded-xl border-2 p-4 text-left transition-all ${
                  matched
                    ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                    : selected
                      ? "border-amber-500 bg-amber-100 shadow-lg dark:bg-amber-900/30"
                      : "border-amber-300/60 bg-white/95 hover:border-amber-400 hover:shadow-md dark:border-amber-700/50 dark:bg-green-950/85 dark:hover:border-amber-600"
                } ${
                  matched || selectedCards.length === 2
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
              >
                <div className="mb-2 text-xs font-bold uppercase tracking-wide text-green-900 dark:text-white/60">
                  Definisjon
                </div>
                <div
                  className={`text-base font-medium ${
                    matched
                      ? "text-green-900 dark:text-green-100"
                      : selected
                        ? "text-amber-900 dark:text-amber-100"
                        : "text-green-950 dark:text-white"
                  }`}
                >
                  {card.content}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

