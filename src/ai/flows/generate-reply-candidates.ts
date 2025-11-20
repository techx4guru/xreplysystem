'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating reply candidates for a given post.
 *
 * - generateReplyCandidates - A function that takes a postId and generates reply candidates using a GenAI model.
 * - GenerateReplyCandidatesInput - The input type for the generateReplyCandidates function.
 * - GenerateReplyCandidatesOutput - The return type for the generateReplyCandidates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReplyCandidatesInputSchema = z.object({
  postId: z.string().describe('The ID of the post to generate reply candidates for.'),
});
export type GenerateReplyCandidatesInput = z.infer<
  typeof GenerateReplyCandidatesInputSchema
>;

const GenerateReplyCandidatesOutputSchema = z.object({
  candidates: z.array(
    z.object({
      text: z.string().describe('The generated reply candidate text.'),
      tone: z.string().describe('The tone of the reply candidate.'),
      emojis: z.array(z.string()).describe('The emojis used in the reply candidate.'),
      safetyScore: z.number().describe('The safety score of the reply candidate.'),
      semanticVector: z.array(z.number()).optional().describe('The semantic vector of the reply candidate.'),
      createdAt: z.date().describe('The creation timestamp of the reply candidate.'),
      generatedBy: z.string().describe('The ID of the function/worker that generated the reply candidate.'),
    })
  ).describe('The generated reply candidates.'),
});

export type GenerateReplyCandidatesOutput = z.infer<
  typeof GenerateReplyCandidatesOutputSchema
>;

export async function generateReplyCandidates(
  input: GenerateReplyCandidatesInput
): Promise<GenerateReplyCandidatesOutput> {
  return generateReplyCandidatesFlow(input);
}

const generateReplyCandidatesPrompt = ai.definePrompt({
  name: 'generateReplyCandidatesPrompt',
  input: {schema: GenerateReplyCandidatesInputSchema},
  output: {schema: GenerateReplyCandidatesOutputSchema},
  prompt: `You are an expert social media manager. Given a post, generate 3 reply candidates that are engaging, relevant, and safe.\n\nPost ID: {{{postId}}}`,
});

const generateReplyCandidatesFlow = ai.defineFlow(
  {
    name: 'generateReplyCandidatesFlow',
    inputSchema: GenerateReplyCandidatesInputSchema,
    outputSchema: GenerateReplyCandidatesOutputSchema,
  },
  async input => {
    const {output} = await generateReplyCandidatesPrompt(input);
    return output!;
  }
);
