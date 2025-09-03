"use client";

import { GameState, Mark } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { User } from "lucide-react";

interface TurnIndicatorProps {
  gameState: GameState;
  currentPlayerId: string;
}

function PlayerDisplay({
  mark,
  player,
  isTurn,
  isMe,
}: {
  mark: Mark;
  player: string;
  isTurn: boolean;
  isMe: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all w-48",
        isTurn ? "bg-primary/20 border-primary shadow-lg" : "bg-card border-transparent",
        mark === "X" ? "text-primary" : "text-accent"
      )}
    >
      <div className="text-5xl font-bold">{mark}</div>
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
            <AvatarFallback className={cn(isTurn ? "bg-primary/80 text-primary-foreground" : "bg-muted")}>
                <User/>
            </AvatarFallback>
        </Avatar>
        <div className="font-semibold text-foreground truncate">{isMe ? "You" : "Opponent"}</div>
      </div>
    </div>
  );
}

export default function TurnIndicator({ gameState, currentPlayerId }: TurnIndicatorProps) {
  const isXMe = gameState.x_player === currentPlayerId;
  const isOMe = gameState.o_player === currentPlayerId;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8">
      <PlayerDisplay
        mark="X"
        player={gameState.x_player}
        isTurn={gameState.turn === "X" && !gameState.finished}
        isMe={isXMe}
      />
      <div className="text-2xl font-bold text-muted-foreground">VS</div>
      <PlayerDisplay
        mark="O"
        player={gameState.o_player}
        isTurn={gameState.turn === "O" && !gameState.finished}
        isMe={isOMe}
      />
    </div>
  );
}
