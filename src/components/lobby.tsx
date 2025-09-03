"use client";

import { Check, Copy, Loader2, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface LobbyProps {
  roomCode: string;
  players: string[];
  isHost: boolean;
  onStartGame: () => void;
}

export default function Lobby({ roomCode, players, isHost, onStartGame }: LobbyProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    toast({ title: "Copied!", description: "Room code copied to clipboard." });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = players.length === 2;

  return (
    <div className="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle className="text-2xl">Room Code</CardTitle>
        <div className="flex items-center justify-center gap-2 mt-2">
          <p className="text-4xl font-bold tracking-widest text-primary">{roomCode}</p>
          <Button variant="ghost" size="icon" onClick={handleCopy}>
            {copied ? <Check className="h-6 w-6 text-green-500" /> : <Copy className="h-6 w-6" />}
          </Button>
        </div>
        <CardDescription className="mt-4">
          Share this code with a friend to start playing.
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-4">
        <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2"><Users /> Players in Lobby ({players.length}/2)</h3>
        <div className="flex flex-col gap-2 items-center">
          {players.map((player, index) => (
            <div key={player} className="flex items-center gap-3 bg-secondary p-2 rounded-md w-full max-w-xs">
              <Avatar>
                <AvatarFallback>{index === 0 ? "P1" : "P2"}</AvatarFallback>
              </Avatar>
              <p className="truncate text-sm font-medium">{player}</p>
            </div>
          ))}
           {players.length < 2 && (
             <div className="flex items-center gap-2 text-muted-foreground p-2">
                <Loader2 className="h-4 w-4 animate-spin"/>
                <span>Waiting for another player...</span>
            </div>
          )}
        </div>
        {isHost && (
          <Button onClick={onStartGame} disabled={!canStart} className="mt-8 w-full h-12 text-lg">
            {canStart ? "Start Game" : "Waiting for 2 players"}
          </Button>
        )}
        {!isHost && <p className="mt-8 text-muted-foreground">Waiting for host to start the game...</p>}
      </CardContent>
    </div>
  );
}
