'use server';
/**
 * @fileOverview A flow to generate and preview sample outputs for prompt template editing.
 *
 * - generateSampleOutput - A function that generates a sample output from a given prompt template.
 * - GenerateSampleOutputInput - The input type for the generateSampleOutput function.
 * - GenerateSampleOutputOutput - The return type for the generateSampleOutput function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSampleOutputInputSchema = z.object({
  promptTemplate: z.string().describe('The prompt template to generate a sample output from.'),
  seed: z.string().optional().describe('Seed prompt to use in the prompt template'),
});
export type GenerateSampleOutputInput = z.infer<typeof GenerateSampleOutputInputSchema>;

const GenerateSampleOutputOutputSchema = z.object({
  sampleOutput: z.string().describe('The generated sample output.'),
});
export type GenerateSampleOutputOutput = z.infer<typeof GenerateSampleOutputOutputSchema>;

export async function generateSampleOutput(input: GenerateSampleOutputInput): Promise<GenerateSampleOutputOutput> {
  return generateSampleOutputFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSampleOutputPrompt',
  input: {schema: GenerateSampleOutputInputSchema},
  output: {schema: GenerateSampleOutputOutputSchema},
  prompt: `{{promptTemplate}}\n\nSeed: {{seed}}`,
});

const generateSampleOutputFlow = ai.defineFlow(
  {
    name: 'generateSampleOutputFlow',
    inputSchema: GenerateSampleOutputInputSchema,
    outputSchema: GenerateSampleOutputOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
