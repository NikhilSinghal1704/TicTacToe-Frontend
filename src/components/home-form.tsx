"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getPlayerId } from "@/lib/player";
import { createRoomAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function HomeForm() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCreateRoom = async () => {
    const playerId = getPlayerId();
    if (!playerId) {
      toast({
        title: "Error",
        description: "Could not generate a player ID. Please try again.",
        variant: "destructive",
      });
      return;
    }
    startTransition(async () => {
      const result = await createRoomAction(playerId);
      if (result?.error) {
          toast({
              title: "Failed to Create Room",
              description: result.error,
              variant: "destructive",
          });
      }
    });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim()) {
      router.push(`/room/${roomCode.trim()}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Button
        onClick={handleCreateRoom}
        disabled={isPending}
        className="w-full h-12 text-lg"
      >
        {isPending ? (
          <Loader2 className="animate-spin" />
        ) : (
          "Create New Room"
        )}
      </Button>

      <div className="flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <form onSubmit={handleJoinRoom} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Enter room code..."
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          className="text-center h-12 text-lg"
          required
        />
        <Button type="submit" variant="secondary" className="w-full h-12 text-lg">
          Join Room
        </Button>
      </form>
    </div>
  );
}
