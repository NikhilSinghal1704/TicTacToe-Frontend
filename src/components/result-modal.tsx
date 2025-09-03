"use client";

import { GameState, Mark } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Award, Hand, XOctagon } from "lucide-react";

interface ResultModalProps {
  gameState: GameState;
  playerMark: Mark | null;
  isHost: boolean;
  onPlayAgain: () => void;
}

export default function ResultModal({ gameState, playerMark, isHost, onPlayAgain }: ResultModalProps) {
  if (!gameState.finished) return null;

  let title, description, Icon;

  if (gameState.winner === "Draw") {
    title = "It's a Draw!";
    description = "A well-fought battle on both sides.";
    Icon = Hand;
  } else if (gameState.winner === playerMark) {
    title = "You Win!";
    description = "Congratulations on your victory!";
    Icon = Award;
  } else {
    title = "You Lose";
    description = "Better luck next time!";
    Icon = XOctagon;
  }

  return (
    <Dialog open={gameState.finished}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          <Icon className="h-16 w-16 text-primary mb-4" />
          <DialogTitle className="text-3xl">{title}</DialogTitle>
          <DialogDescription className="text-lg">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
            {isHost ? (
                <Button onClick={onPlayAgain} size="lg">Play Again</Button>
            ) : (
                <p className="text-muted-foreground">Waiting for host to start a new game...</p>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
