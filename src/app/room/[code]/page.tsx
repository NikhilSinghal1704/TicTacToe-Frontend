"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTicTacToeSocket } from "@/hooks/use-tic-tac-toe-socket";
import { getPlayerId } from "@/lib/player";
import { Loader2, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Lobby from "@/components/lobby";
import Board from "@/components/board";
import ResultModal from "@/components/result-modal";
import HistoryPanel from "@/components/history-panel";
import TurnIndicator from "@/components/turn-indicator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function RoomPage() {
  const params = useParams();
  const roomCode = Array.isArray(params.code) ? params.code[0] : params.code;
  const [playerId, setPlayerId] = useState<string>("");

  useEffect(() => {
    setPlayerId(getPlayerId());
  }, []);

  const {
    gameState,
    players,
    hostId,
    history,
    connectionStatus,
    sendMessage,
    manualReconnect,
  } = useTicTacToeSocket(roomCode, playerId);

  const isHost = playerId === hostId;
  const playerMark = gameState?.x_player === playerId ? "X" : gameState?.o_player === playerId ? "O" : null;

  const renderContent = () => {
    if (connectionStatus === "connecting") {
      return (
        <div className="flex flex-col items-center gap-4 text-lg">
          <Loader2 className="animate-spin h-12 w-12" />
          Connecting to room...
        </div>
      );
    }
    
    if (connectionStatus === "reconnecting") {
      return (
        <div className="flex flex-col items-center gap-4 text-lg">
          <Loader2 className="animate-spin h-12 w-12" />
          Connection lost. Reconnecting...
        </div>
      );
    }

    if (connectionStatus === "disconnected") {
      return (
        <div className="flex flex-col items-center gap-4 text-lg">
          <WifiOff className="h-12 w-12 text-destructive" />
          Disconnected.
          <Button onClick={manualReconnect}>Reconnect</Button>
        </div>
      );
    }

    if (!gameState) {
      return (
        <Lobby
          roomCode={roomCode}
          players={players}
          isHost={isHost}
          onStartGame={() => sendMessage({ action: "start_game" })}
        />
      );
    }

    return (
      <div className="w-full flex flex-col items-center gap-8">
        <TurnIndicator gameState={gameState} currentPlayerId={playerId} />
        <Board
          board={gameState.board}
          onMove={(index) => sendMessage({ action: "make_move", player_id: playerId, index })}
          isMyTurn={playerMark === gameState.turn && !gameState.finished}
        />
      </div>
    );
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 lg:p-8">
       <div className="fixed top-4 right-4 flex items-center gap-2 text-sm text-muted-foreground">
        {connectionStatus === 'connected' && <Wifi className="h-5 w-5 text-green-500" />}
        {connectionStatus === 'reconnecting' && <Loader2 className="h-5 w-5 animate-spin" />}
        {connectionStatus === 'disconnected' && <WifiOff className="h-5 w-5 text-destructive" />}
        <span>{roomCode}</span>
      </div>
      <Card className="w-full max-w-4xl border-2 shadow-lg">
        <CardHeader>
           {gameState && <ResultModal 
            gameState={gameState} 
            playerMark={playerMark} 
            isHost={isHost} 
            onPlayAgain={() => sendMessage({ action: "start_game" })} />}
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
            {renderContent()}
        </CardContent>
      </Card>
      {history.length > 0 && (
          <div className="w-full max-w-4xl mt-8">
            <HistoryPanel history={history} />
          </div>
        )}
    </main>
  );
}
