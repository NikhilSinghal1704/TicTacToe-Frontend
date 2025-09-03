"use client";

import { cn } from "@/lib/utils";
import type { BoardState } from "@/lib/types";

interface CellProps {
  value: "X" | "O" | "";
  onClick: () => void;
  disabled: boolean;
  isWinningCell: boolean;
}

function Cell({ value, onClick, disabled, isWinningCell }: CellProps) {
  const Mark = ({ mark }: { mark: "X" | "O" }) => {
    if (mark === "X") {
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <line x1="15" y1="15" x2="85" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="x-animation" />
          <line x1="85" y1="15" x2="15" y2="85" stroke="currentColor" strokeWidth="12" strokeLinecap="round" className="x-animation" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="12" fill="none" className="o-animation" />
      </svg>
    );
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || !!value}
      className={cn(
        "relative flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-card rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-primary/50",
        "disabled:cursor-not-allowed",
        !value && "hover:bg-accent/20",
        value === "X" ? "text-primary" : "text-accent",
        isWinningCell && "bg-primary/20 scale-105"
      )}
      aria-label={`Cell ${value || 'empty'}`}
    >
      <div className="w-1/2 h-1/2">
        {value && <Mark mark={value} />}
      </div>
    </button>
  );
}


const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

function getWinningCombination(board: BoardState): number[] | null {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination;
    }
  }
  return null;
}


interface BoardProps {
  board: BoardState;
  onMove: (index: number) => void;
  isMyTurn: boolean;
}

export default function Board({ board, onMove, isMyTurn }: BoardProps) {
  const winningCombination = getWinningCombination(board);

  return (
    <div className="grid grid-cols-3 grid-rows-3 gap-3 p-3 bg-secondary/50 rounded-xl shadow-inner">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onMove(index)}
          disabled={!isMyTurn}
          isWinningCell={!!winningCombination?.includes(index)}
        />
      ))}
    </div>
  );
}
