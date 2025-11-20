'use server';

/**
 * @fileOverview This flow assesses the safety of a candidate reply using a GenAI model.
 *
 * - assessCandidateSafety - A function that handles the safety assessment process.
 * - AssessCandidateSafetyInput - The input type for the assessCandidateSafety function.
 * - AssessCandidateSafetyOutput - The return type for the assessCandidateSafety function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessCandidateSafetyInputSchema = z.object({
  text: z.string().describe('The text of the candidate reply to assess.'),
});
export type AssessCandidateSafetyInput = z.infer<typeof AssessCandidateSafetyInputSchema>;

const AssessCandidateSafetyOutputSchema = z.object({
  toxicity: z.number().describe('A score indicating the toxicity of the text (0-1, higher is more toxic).'),
  political: z.number().describe('A score indicating if the text is political (0-1).'),
  medical: z.number().describe('A score indicating if the text contains medical content (0-1).'),
  doxx: z.number().describe('A score indicating if the text contains personal information (0-1).'),
});
export type AssessCandidateSafetyOutput = z.infer<typeof AssessCandidateSafetyOutputSchema>;

export async function assessCandidateSafety(input: AssessCandidateSafetyInput): Promise<AssessCandidateSafetyOutput> {
  return assessCandidateSafetyFlow(input);
}

const assessCandidateSafetyPrompt = ai.definePrompt({
  name: 'assessCandidateSafetyPrompt',
  input: {schema: AssessCandidateSafetyInputSchema},
  output: {schema: AssessCandidateSafetyOutputSchema},
  prompt: `You are an AI safety assistant. Assess the following text for safety issues and output scores.

Text: {{{text}}}

Output a JSON object with the following keys:
- toxicity: A score indicating the toxicity of the text (0-1, higher is more toxic).
- political: A score indicating if the text is political (0-1).
- medical: A score indicating if the text contains medical content (0-1).
- doxx: A score indicating if the text contains personal information (0-1).`,
});

const assessCandidateSafetyFlow = ai.defineFlow(
  {
    name: 'assessCandidateSafetyFlow',
    inputSchema: AssessCandidateSafetyInputSchema,
    outputSchema: AssessCandidateSafetyOutputSchema,
  },
  async input => {
    const {output} = await assessCandidateSafetyPrompt(input);
    return output!;
  }
);
