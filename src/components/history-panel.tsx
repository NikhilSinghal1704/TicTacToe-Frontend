"use client";

import { GameHistoryEntry } from "@/lib/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { summarizeHistoryAction } from "@/app/actions";
import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface HistoryPanelProps {
  history: GameHistoryEntry[];
}

export default function HistoryPanel({ history }: HistoryPanelProps) {
  const [summary, setSummary] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAccordionChange = (value: string) => {
    if (value === "item-1" && !summary) {
      startTransition(async () => {
        const result = await summarizeHistoryAction(history);
        if (result.summary) {
          setSummary(result.summary);
        } else if (result.error) {
          setSummary("Could not load AI summary.");
        }
      });
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full bg-card rounded-lg border-2" onValueChange={handleAccordionChange}>
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-lg px-6">Game History</AccordionTrigger>
        <AccordionContent className="px-6">
          <h3 className="font-semibold mb-2">AI Summary</h3>
          <div className="prose prose-sm dark:prose-invert bg-secondary/50 p-4 rounded-md min-h-[80px]">
            {isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Generating summary...</span>
              </div>
            ) : (
              <p>{summary}</p>
            )}
          </div>

          <h3 className="font-semibold mt-4 mb-2">Match Details</h3>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
            {history.map((game, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-secondary/50 rounded-md">
                <p>Game {history.length - index}</p>
                <Badge variant={game.winner === "Draw" ? "secondary" : "default"}>
                    {game.winner ? (game.winner === "Draw" ? "Draw" : `${game.winner} Won`) : "Incomplete"}
                </Badge>
              </div>
            ))}
            </div>
          </ScrollArea>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
