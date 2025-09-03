export type Player = string;
export type Mark = "X" | "O";
export type BoardState = (Mark | "")[];

export interface GameState {
  x_player: Player;
  o_player: Player;
  board: BoardState;
  turn: Mark;
  finished: boolean;
  winner: Mark | "Draw" | null;
}

export interface GameHistoryEntry {
  x_player: string;
  o_player: string;
  board: string[];
  finished: boolean;
  winner: string | null;
}

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "reconnecting";

// Incoming WebSocket Messages
export interface RoomUpdateMessage {
  type: "room_update";
  players: Player[];
  host_id: Player;
}

export interface GameStartedMessage {
  type: "game_started";
  x_player: Player;
  o_player: Player;
  board: BoardState;
  turn: Mark;
}

export interface GameUpdateMessage {
  type: "game_update";
  board: BoardState;
  finished: boolean;
  winner: Mark | "Draw" | null;
  x_player: Player;
  o_player: Player;
  turn: Mark;
}

export interface ResumeGameMessage {
  type: "resume_game";
  x_player: Player;
  o_player: Player;
  board: BoardState;
  finished: boolean;
  winner: Mark | "Draw" | null;
  turn: Mark;
}

export interface NoGameToResumeMessage {
  type: "no_game_to_resume";
}

export interface GameHistoryMessage {
  type: "history";
  history: GameHistoryEntry[];
}

export interface ErrorMessage {
  type: "error";
  message: string;
}

export type WebSocketMessage =
  | RoomUpdateMessage
  | GameStartedMessage
  | GameUpdateMessage
  | ResumeGameMessage
  | NoGameToResumeMessage
  | GameHistoryMessage
  | ErrorMessage;
  
// Outgoing WebSocket Actions
export interface StartGameAction {
  action: "start_game";
}

export interface MakeMoveAction {
  action: "make_move";
  player_id: Player;
  index: number;
}

export interface ResumeGameAction {
  action: "resume_game";
  player_id: Player;
}

export interface RequestHistoryAction {
  action: "request_history";
}

export type WebSocketAction =
  | StartGameAction
  | MakeMoveAction
  | ResumeGameAction
  | RequestHistoryAction;
