// Summarizes the game history to provide win/loss/draw statistics.

'use server';

/**
 * @fileOverview Summarizes game history for a given room.
 *
 * - summarizeGameHistory - A function that summarizes the game history.
 * - SummarizeGameHistoryInput - The input type for the summarizeGameHistory function.
 * - SummarizeGameHistoryOutput - The return type for the summarizeGameHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeGameHistoryInputSchema = z.array(
  z.object({
    x_player: z.string(),
    o_player: z.string(),
    board: z.array(z.string()),
    finished: z.boolean(),
    winner: z.string().nullable(),
  })
);
export type SummarizeGameHistoryInput = z.infer<
  typeof SummarizeGameHistoryInputSchema
>;

const SummarizeGameHistoryOutputSchema = z.object({
  summary: z.string().describe('A summary of the game history.'),
});
export type SummarizeGameHistoryOutput = z.infer<
  typeof SummarizeGameHistoryOutputSchema
>;

export async function summarizeGameHistory(
  input: SummarizeGameHistoryInput
): Promise<SummarizeGameHistoryOutput> {
  return summarizeGameHistoryFlow(input);
}

const summarizeGameHistoryPrompt = ai.definePrompt({
  name: 'summarizeGameHistoryPrompt',
  input: {schema: SummarizeGameHistoryInputSchema},
  output: {schema: SummarizeGameHistoryOutputSchema},
  prompt: `You are an expert game analyst. Summarize the following game history, providing win/loss/draw statistics for each player:

Game History:
{{#each this}}
  Game {{@index}}:
    X Player: {{x_player}}
    O Player: {{o_player}}
    Winner: {{winner}}
{{/each}}

Summary: `,
});

const summarizeGameHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeGameHistoryFlow',
    inputSchema: SummarizeGameHistoryInputSchema,
    outputSchema: SummarizeGameHistoryOutputSchema,
  },
  async input => {
    const {output} = await summarizeGameHistoryPrompt(input);
    return output!;
  }
);
