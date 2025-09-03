"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type {
  ConnectionStatus,
  GameHistoryEntry,
  GameState,
  Player,
  WebSocketAction,
  WebSocketMessage,
} from "@/lib/types";
import { useToast } from "./use-toast";

const WEBSOCKET_URL = "wss://tictactoe.nik-server.in/ws/tictactoe/";
const MAX_RETRIES = 5;

export function useTicTacToeSocket(roomCode: string, playerId: string) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [hostId, setHostId] = useState<Player | null>(null);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const ws = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const { toast } = useToast();

  const connect = useCallback(() => {
    if (!playerId || !roomCode) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        return;
    }
    
    setConnectionStatus(retryCount.current > 0 ? "reconnecting" : "connecting");

    const socket = new WebSocket(`${WEBSOCKET_URL}${roomCode}/?player_id=${playerId}`);

    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnectionStatus("connected");
      retryCount.current = 0;
      // On reconnect, try to resume game
      if (retryCount.current > 0 || performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        socket.send(JSON.stringify({ action: "resume_game", player_id: playerId }));
      }
    };

    socket.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case "room_update":
          setPlayers(message.players);
          setHostId(message.host_id);
          // If a game was in progress, and now we are back to lobby, reset state
          if (gameState) {
             setGameState(null);
          }
          break;
        case "game_started":
        case "game_update":
        case "resume_game":
          setGameState({
            board: message.board,
            turn: message.turn,
            x_player: message.x_player,
            o_player: message.o_player,
            finished: 'finished' in message ? message.finished : false,
            winner: 'winner' in message ? message.winner : null,
          });
          break;
        case "no_game_to_resume":
          // No game to resume, so we are in lobby state
          setGameState(null);
          break;
        case "history":
          setHistory(message.history);
          break;
        case "error":
          toast({
            title: "Game Error",
            description: message.message,
            variant: "destructive",
          });
          break;
      }
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
      if (retryCount.current < MAX_RETRIES) {
        const delay = Math.pow(2, retryCount.current) * 1000;
        setTimeout(() => {
          retryCount.current++;
          connect();
        }, delay);
        setConnectionStatus("reconnecting");
      } else {
        setConnectionStatus("disconnected");
        toast({
          title: "Connection Lost",
          description: "Could not reconnect to the server.",
          variant: "destructive",
        });
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Connection Error",
        description: "An error occurred with the connection.",
        variant: "destructive",
      });
      socket.close();
    };

    ws.current = socket;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, playerId, toast]);

  useEffect(() => {
    if (playerId && roomCode) {
      connect();
    }
    return () => {
      ws.current?.close();
    };
  }, [playerId, roomCode, connect]);

  const sendMessage = (action: WebSocketAction) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(action));
    } else {
      console.error("WebSocket is not connected.");
      toast({
        title: "Not Connected",
        description: "You are not connected to the server.",
        variant: "destructive",
      });
    }
  };

  const manualReconnect = () => {
    if (connectionStatus === 'disconnected') {
      retryCount.current = 0;
      connect();
    }
  }

  return {
    gameState,
    players,
    hostId,
    history,
    connectionStatus,
    sendMessage,
    manualReconnect
  };
}
