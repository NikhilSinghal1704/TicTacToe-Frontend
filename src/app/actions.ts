"use server";

import { summarizeGameHistory, type SummarizeGameHistoryInput } from "@/ai/flows/summarize-game-history";
import { redirect } from "next/navigation";

const API_BASE_URL = "https://tictactoe.nik-server.in/api";

export async function createRoomAction(playerId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/create-room/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ player_id: playerId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to create room:", errorData);
      throw new Error(`Failed to create room: ${errorData.detail || response.statusText}`);
    }

    const room = await response.json();
    if (room && room.code) {
      redirect(`/room/${room.code}`);
    } else {
        throw new Error("Room code not found in response.");
    }
  } catch (error) {
    console.error("Error creating room:", error);
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred."}
  }
}

export async function summarizeHistoryAction(history: SummarizeGameHistoryInput): Promise<{ summary?: string; error?: string }> {
    try {
        const result = await summarizeGameHistory(history);
        return { summary: result.summary };
    } catch (error) {
        console.error("Error summarizing history:", error);
        if (error instanceof Error) {
            return { error: error.message };
        }
        return { error: "Failed to get AI summary." };
    }
}
