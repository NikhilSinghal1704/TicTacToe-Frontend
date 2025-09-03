"use client";

export function getPlayerId(): string {
  if (typeof window === "undefined") {
    return ""; // Return empty string on the server
  }
  let id = localStorage.getItem("player_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("player_id", id);
  }
  return id;
}
